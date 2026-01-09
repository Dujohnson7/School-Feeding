import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format as formatDate } from 'date-fns'

// Helper function to get current user info from localStorage
export const getCurrentUserInfo = () => {
  try {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    const user = JSON.parse(userStr)
    const role = localStorage.getItem("role") || user.role || ""

    // Handle different district object structures
    let districtName = ""
    if (user.district) {
      if (typeof user.district === 'string') {
        districtName = user.district
      } else if (user.district.district) {
        districtName = user.district.district
      } else if (user.district.name) {
        districtName = user.district.name
      }
    }

    return {
      id: user.id || localStorage.getItem("userId") || "",
      names: user.names || "",
      role: role.trim().toUpperCase().replace(/^ROLE_/, ""),
      districtId: user.district?.id || localStorage.getItem("districtId") || "",
      schoolId: user.school?.id || localStorage.getItem("schoolId") || "",
      districtName: districtName || localStorage.getItem("districtName") || "",
      schoolName: user.school?.name || "",
      province: user.district?.province || user.school?.province || "",
      supplierName: role.toUpperCase() === "SUPPLIER" ? user.names : ""
    }

  } catch (e) {
    console.error("Error parsing user info from localStorage", e)
    return null
  }
}

// Helper function to load image as base64
const loadImageAsBase64 = async (imagePath: string): Promise<string> => {
  try {
    const response = await fetch(imagePath)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error loading image:', error)
    return ''
  }
}

// Helper function to add header with logo and title (matching the image format exactly)
const addReportHeader = async (
  doc: jsPDF,
  reportTitle: string,
  options: {
    type: 'school' | 'stock' | 'district' | 'supplier' | 'gov'
    entityInfo: {
      name?: string
      province?: string
      district?: string
      supplierName?: string
    }
    dateFrom?: Date | string
    dateTo?: Date | string
  }
) => {
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 15

  // Add logo
  try {
    const logoBase64 = await loadImageAsBase64(`${window.location.origin}/logoSF.png`)
    if (logoBase64) {
      const textWidth = doc.getTextWidth('SCHOOL FEEDING')
      const logoWidth = 30
      const logoX = 13 + (textWidth - logoWidth) / 2
      doc.addImage(logoBase64, 'PNG', logoX, yPos, logoWidth, 30) // Height increased to 30
    }
  } catch (error) {
    console.error('Error adding logo:', error)
  }

  yPos += 37
  // SCHOOL FEEDING (Blue)
  doc.setTextColor(43, 108, 176) // #2b6cb0
  doc.setFontSize(12)
  doc.setFont('times', 'bold')
  doc.text('SCHOOL FEEDING', 20, yPos)

  yPos += 12
  doc.setFontSize(11)

  const { type, entityInfo, dateFrom, dateTo } = options

  // Helper to draw label: value
  const drawLine = (label: string, value: string, labelColor: [number, number, number]) => {
    doc.setTextColor(...labelColor)
    doc.setFont('times', 'bold')
    doc.text(`${label}:`, 20, yPos)
    doc.setTextColor(0, 0, 0)
    doc.setFont('times', 'normal')
    doc.text(` ${value}`, 20 + doc.getTextWidth(`${label}: `), yPos)
    yPos += 7
  }

  const BLUE = [26, 54, 93] as [number, number, number] // #1a365d
  const RED = [229, 62, 62] as [number, number, number] // #e53e3e
  const GREEN = [46, 125, 50] as [number, number, number] // #2e7d32
  const ORANGE = [192, 86, 33] as [number, number, number] // #c05621

  if (type === 'school' || type === 'stock') {
    drawLine('School', entityInfo.name || 'N/A', RED)
    drawLine('Province', entityInfo.province || 'N/A', BLUE)
    drawLine('District', entityInfo.district || 'N/A', GREEN)
  } else if (type === 'district') {
    drawLine('Province', entityInfo.province || 'N/A', BLUE)
    drawLine('District', entityInfo.district || 'N/A', GREEN)
  } else if (type === 'supplier') {
    drawLine('Supplier', entityInfo.supplierName || 'N/A', RED)
    drawLine('Province', entityInfo.province || 'N/A', BLUE)
    drawLine('District', entityInfo.district || 'N/A', GREEN)
  } else if (type === 'gov') {
    drawLine('MINEDUC', 'N/A', RED)
  }

  // Dates (Orange)
  if (dateFrom && dateTo) {
    const fromStr = dateFrom instanceof Date ? formatDate(dateFrom, 'd MMMM yyyy') : dateFrom
    const toStr = dateTo instanceof Date ? formatDate(dateTo, 'd MMMM yyyy') : dateTo

    doc.setTextColor(...ORANGE)
    doc.setFont('times', 'bold')
    doc.text('From:', 20, yPos)
    doc.setTextColor(0, 0, 0)
    doc.setFont('times', 'normal')
    doc.text(` ${fromStr}`, 20 + doc.getTextWidth('From: '), yPos)

    const nextX = 20 + doc.getTextWidth('From: ') + doc.getTextWidth(` ${fromStr}`) + 10
    doc.setTextColor(...ORANGE)
    doc.setFont('times', 'bold')
    doc.text('To:', nextX, yPos)
    doc.setTextColor(0, 0, 0)
    doc.setFont('times', 'normal')
    doc.text(` ${toStr}`, nextX + doc.getTextWidth('To: '), yPos)
    yPos += 15
  } else {
    yPos += 10
  }

  // Centered Title (Dark Blue)
  doc.setTextColor(44, 82, 130) // #2c5282
  doc.setFontSize(16) // Reduced from 22
  doc.setFont('times', 'bold')
  const titleWidth = doc.getTextWidth(reportTitle)
  doc.text(reportTitle, (pageWidth - titleWidth) / 2, yPos)
  yPos += 12

  return yPos
}

// Helper function to add footer with generator date (matching picture format)
const addReportFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFontSize(10)
  doc.setFont('times', 'italic')
  doc.setTextColor(0, 0, 0)

  const footerText = `Generator on ${formatDate(new Date(), 'dd MMMM yyyy')}`
  const footerWidth = doc.getTextWidth(footerText)
  doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 12)
}

interface SchoolInfo {
  name?: string
  id?: string
  district?: string
  community?: string
  province?: string
}

interface FoodItem {
  id?: string
  name?: string
  unit?: string
}

interface InventoryData {
  date: string
  stockAtStart: number
  foodReceived: number
  handedOut: number
  missing: number
  suspectedUnfit: number
  confirmedUnfit: number
  disposed: number
  stockAtEnd: number
  remarks?: string
}

export const exportFoodTrackingSheetPDF = async (
  schoolInfo: SchoolInfo,
  foodItem: FoodItem,
  monthYear: string,
  inventoryData: InventoryData[]
) => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // Parse month/year to get date range
    let dateFrom: Date | undefined
    let dateTo: Date | undefined

    try {
      // Try to parse month/year (e.g., "November 2025" or "11 2025")
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
      const parts = monthYear.split(' ')
      if (parts.length >= 2) {
        const monthStr = parts[0]
        const yearStr = parts[parts.length - 1]
        const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthStr.toLowerCase())
        const month = monthIndex !== -1 ? monthIndex + 1 : parseInt(monthStr)
        const year = parseInt(yearStr)

        if (!isNaN(month) && !isNaN(year)) {
          dateFrom = new Date(year, month - 1, 1)
          const lastDay = new Date(year, month, 0).getDate()
          dateTo = new Date(year, month - 1, lastDay)
        }
      }
    } catch (error) {
      console.error('Error parsing month/year:', error)
    }

    // Add header with logo and School Feeding - use actual report title
    // All information is now in the header (School, Province, District, From, To)
    let yPos = await addReportHeader(doc, 'Food Tracking Sheet Report', {
      type: 'school',
      entityInfo: {
        name: schoolInfo.name,
        province: schoolInfo.province,
        district: schoolInfo.district,
      },
      dateFrom,
      dateTo
    })

    // Table headers
    const headers = [
      ['Date', 'Unit (kg, piece, etc.)', 'Stock at start', 'Food received',
        'Handed out', 'Signature cook rep', 'Missing', 'Suspected unfit',
        'Confirmed unfit', 'Disposed', 'Total', 'Stock at end', 'Remarks']
    ]

    // Prepare table data
    const tableData = inventoryData.map(item => [
      formatDate(new Date(item.date), 'dd/MM/yyyy'),
      foodItem.unit || 'kg',
      item.stockAtStart.toString(),
      item.foodReceived.toString(),
      item.handedOut.toString(),
      '', // Signature - empty
      item.missing.toString(),
      item.suspectedUnfit.toString(),
      item.confirmedUnfit.toString(),
      item.disposed.toString(),
      (item.missing + item.suspectedUnfit + item.confirmedUnfit + item.disposed).toString(),
      item.stockAtEnd.toString(),
      item.remarks || ''
    ])

    // Create table with custom styling (black borders, matching picture)
    autoTable(doc, {
      head: headers,
      body: tableData,
      startY: yPos,
      styles: {
        fontSize: 7,
        cellPadding: 3,
        overflow: 'linebreak',
        lineColor: [0, 0, 0], // Black borders
        lineWidth: 0.1, // Thinner, more attractive borders
        fillColor: [255, 255, 255], // White background for cells
        textColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [248, 248, 248], // Light gray header
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7,
        lineColor: [0, 0, 0], // Black borders
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Date
        1: { cellWidth: 25 }, // Unit
        2: { cellWidth: 25 }, // Stock at start
        3: { cellWidth: 25 }, // Food received
        4: { cellWidth: 25 }, // Handed out
        5: { cellWidth: 30 }, // Signature
        6: { cellWidth: 20 }, // Missing
        7: { cellWidth: 25 }, // Suspected unfit
        8: { cellWidth: 25 }, // Confirmed unfit
        9: { cellWidth: 20 }, // Disposed
        10: { cellWidth: 20 }, // Total
        11: { cellWidth: 25 }, // Stock at end
        12: { cellWidth: 40 } // Remarks
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252], // Subtle alternate row color
        lineColor: [0, 0, 0], // Black borders
        lineWidth: 0.1
      },
      margin: { top: yPos, left: 15, right: 15 }
    })

    // Add footer with generator date
    addReportFooter(doc)

    // Save the PDF
    const fileName = `Food_Tracking_Sheet_${schoolInfo.name?.replace(/\s+/g, '_')}_${foodItem.name?.replace(/\s+/g, '_')}_${monthYear.replace(/\s+/g, '_')}.pdf`
    doc.save(fileName)

    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

export const exportFoodTrackingSheetCSV = (
  schoolInfo: SchoolInfo,
  foodItem: FoodItem,
  monthYear: string,
  inventoryData: InventoryData[]
) => {
  try {
    const headers = [
      'Date', 'Unit', 'Stock at start', 'Food received', 'Handed out',
      'Signature cook rep', 'Missing', 'Suspected unfit', 'Confirmed unfit',
      'Disposed', 'Total', 'Stock at end', 'Remarks'
    ]

    const csvRows = [
      [`Annex 3: Food Tracking Sheet`],
      [`This sheet should be filled separately for each food item, and for each month.`],
      [],
      [`Name of school:,${schoolInfo.name || 'N/A'}`],
      [`Community:,${schoolInfo.community || 'N/A'}`],
      [`School ID:,${schoolInfo.id || 'N/A'}`],
      [`Food item:,${foodItem.name || 'N/A'}`],
      [`District:,${schoolInfo.district || 'N/A'}`],
      [`Month / Year:,${monthYear}`],
      [],
      [headers.join(',')]
    ]

    inventoryData.forEach(item => {
      const row = [
        formatDate(new Date(item.date), 'dd/MM/yyyy'),
        foodItem.unit || 'kg',
        item.stockAtStart.toString(),
        item.foodReceived.toString(),
        item.handedOut.toString(),
        '', // Signature
        item.missing.toString(),
        item.suspectedUnfit.toString(),
        item.confirmedUnfit.toString(),
        item.disposed.toString(),
        (item.missing + item.suspectedUnfit + item.confirmedUnfit + item.disposed).toString(),
        item.stockAtEnd.toString(),
        item.remarks || ''
      ]
      csvRows.push([row.join(',')])
    })

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `Food_Tracking_Sheet_${schoolInfo.name?.replace(/\s+/g, '_')}_${foodItem.name?.replace(/\s+/g, '_')}_${monthYear.replace(/\s+/g, '_')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error('Error generating CSV:', error)
    throw error
  }
}

export const exportFoodTrackingSheetExcel = async (
  schoolInfo: SchoolInfo,
  foodItem: FoodItem,
  monthYear: string,
  inventoryData: InventoryData[]
) => {
  try {
    // For Excel, we'll create a CSV-like format that Excel can open
    const headers = [
      'Date', 'Unit', 'Stock at start', 'Food received', 'Handed out',
      'Signature cook rep', 'Missing', 'Suspected unfit', 'Confirmed unfit',
      'Disposed', 'Total', 'Stock at end', 'Remarks'
    ]

    let excelContent = `Annex 3: Food Tracking Sheet\n`
    excelContent += `This sheet should be filled separately for each food item, and for each month.\n\n`
    excelContent += `Name of school:\t${schoolInfo.name || 'N/A'}\n`
    excelContent += `Community:\t${schoolInfo.community || 'N/A'}\n`
    excelContent += `School ID:\t${schoolInfo.id || 'N/A'}\n`
    excelContent += `Food item:\t${foodItem.name || 'N/A'}\n`
    excelContent += `District:\t${schoolInfo.district || 'N/A'}\n`
    excelContent += `Month / Year:\t${monthYear}\n\n`
    excelContent += headers.join('\t') + '\n'

    inventoryData.forEach(item => {
      const row = [
        formatDate(new Date(item.date), 'dd/MM/yyyy'),
        foodItem.unit || 'kg',
        item.stockAtStart.toString(),
        item.foodReceived.toString(),
        item.handedOut.toString(),
        '', // Signature
        item.missing.toString(),
        item.suspectedUnfit.toString(),
        item.confirmedUnfit.toString(),
        item.disposed.toString(),
        (item.missing + item.suspectedUnfit + item.confirmedUnfit + item.disposed).toString(),
        item.stockAtEnd.toString(),
        item.remarks || ''
      ]
      excelContent += row.join('\t') + '\n'
    })

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `Food_Tracking_Sheet_${schoolInfo.name?.replace(/\s+/g, '_')}_${foodItem.name?.replace(/\s+/g, '_')}_${monthYear.replace(/\s+/g, '_')}.xls`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error('Error generating Excel:', error)
    throw error
  }
}

// Stock Report Generation
export const generateStockReport = async (
  reportType: string,
  dateRange: { from?: Date; to?: Date },
  format: 'pdf' | 'csv' | 'excel',
  data: any,
  schoolInfo?: {
    school?: string
    province?: string
    district?: string
  }
) => {
  try {
    const userInfo = getCurrentUserInfo()
    const finalSchoolInfo = {
      school: schoolInfo?.school || userInfo?.schoolName || userInfo?.supplierName || "N/A",
      province: schoolInfo?.province || userInfo?.province || "N/A",
      district: schoolInfo?.district || userInfo?.districtName || "N/A",
    }

    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPos = await addReportHeader(doc, `${reportType} Report`, {
        type: 'stock',
        entityInfo: {
          name: finalSchoolInfo.school,
          province: finalSchoolInfo.province,
          district: finalSchoolInfo.district,
        },
        dateFrom: dateRange.from,
        dateTo: dateRange.to
      })

      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const tableData = data.map((row: any) => headers.map((key) => String(row[key] ?? '')))

        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: yPos,
          styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0]
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          },
          margin: { left: 15, right: 15 }
        })
      }

      addReportFooter(doc)
      const fileName = `Stock_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.pdf`
      doc.save(fileName)
    } else if (format === 'csv') {
      const headers = data && data.length > 0 ? Object.keys(data[0]) : []
      const csvRows = [
        ['School Feeding Program - Stock Management Report'],
        [`Report Type: ${reportType}`],
        [`Generated: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`],
        [],
        [headers.join(',')]
      ]

      if (data) {
        data.forEach((row: any) => {
          csvRows.push([headers.map(key => String(row[key] || '')).join(',')])
        })
      }

      const csvContent = csvRows.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `Stock_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    return true
  } catch (error) {
    console.error('Error generating stock report:', error)
    throw error
  }
}

// Supplier Report Generation
export const generateSupplierReport = async (
  reportType: string,
  dateRange: { from?: Date; to?: Date },
  format: 'pdf' | 'csv' | 'excel',
  data: any,
  schoolInfo?: {
    school?: string
    province?: string
    district?: string
  }
) => {
  try {
    const userInfo = getCurrentUserInfo()
    const finalInfo = {
      supplier: schoolInfo?.school || userInfo?.supplierName || userInfo?.names || "N/A",
      province: schoolInfo?.province || userInfo?.province || "N/A",
      district: schoolInfo?.district || userInfo?.districtName || "N/A",
    }

    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPos = await addReportHeader(doc, `${reportType} Report`, {
        type: 'supplier',
        entityInfo: {
          supplierName: finalInfo.supplier,
          province: finalInfo.province,
          district: finalInfo.district,
        },
        dateFrom: dateRange.from,
        dateTo: dateRange.to
      })

      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const tableData = data.map((row: any) => headers.map((key) => String(row[key] ?? '')))

        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: yPos,
          styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0]
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          },
          margin: { left: 15, right: 15 }
        })
      }

      addReportFooter(doc)
      const fileName = `Supplier_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.pdf`
      doc.save(fileName)
    } else if (format === 'csv') {
      const headers = data && data.length > 0 ? Object.keys(data[0]) : []
      const csvRows = [
        ['School Feeding Program - Supplier Report'],
        [`Report Type: ${reportType}`],
        [`Generated: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`],
        [],
        [headers.join(',')]
      ]

      if (data) {
        data.forEach((row: any) => {
          csvRows.push([headers.map(key => String(row[key] || '')).join(',')])
        })
      }

      const csvContent = csvRows.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `Supplier_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    return true
  } catch (error) {
    console.error('Error generating supplier report:', error)
    throw error
  }
}

// District Report Generation
export const generateDistrictReport = async (
  reportType: string,
  dateRange: { from?: Date; to?: Date },
  format: 'pdf' | 'csv' | 'excel',
  data: any,
  schoolInfo?: {
    school?: string
    province?: string
    district?: string
  }
) => {
  try {
    const userInfo = getCurrentUserInfo()
    const finalInfo = {
      province: schoolInfo?.province || userInfo?.province || "N/A",
      district: schoolInfo?.district || userInfo?.districtName || "N/A",
    }

    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPos = await addReportHeader(doc, `${reportType} Report`, {
        type: 'district',
        entityInfo: {
          province: finalInfo.province,
          district: finalInfo.district,
        },
        dateFrom: dateRange.from,
        dateTo: dateRange.to
      })

      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const tableData = data.map((row: any) => headers.map((key) => String(row[key] ?? '')))

        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: yPos,
          styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0]
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          },
          margin: { left: 15, right: 15 }
        })
      }

      addReportFooter(doc)
      const fileName = `District_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.pdf`
      doc.save(fileName)
    } else if (format === 'csv') {
      const headers = data && data.length > 0 ? Object.keys(data[0]) : []
      const csvRows = [
        ['School Feeding Program - District Report'],
        [`Report Type: ${reportType}`],
        [`Generated: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`],
        [],
        [headers.join(',')]
      ]

      if (data) {
        data.forEach((row: any) => {
          csvRows.push([headers.map(key => String(row[key] || '')).join(',')])
        })
      }

      const csvContent = csvRows.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `District_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    return true
  } catch (error) {
    console.error('Error generating district report:', error)
    throw error
  }
}

// Government Report Generation
export const generateGovReport = async (
  reportType: string,
  dateRange: { from?: Date; to?: Date },
  format: 'pdf' | 'csv' | 'excel',
  data: any
) => {
  try {
    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPos = await addReportHeader(doc, `${reportType} Report`, {
        type: 'gov',
        entityInfo: {
          name: 'MINEDUC'
        },
        dateFrom: dateRange.from,
        dateTo: dateRange.to
      })

      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const tableData = data.map((row: any) => headers.map((key) => String(row[key] || '')))

        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: yPos,
          styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0]
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.1
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            lineColor: [0, 0, 0],
            lineWidth: 0.1
          },
          margin: { left: 15, right: 15 }
        })
      }

      addReportFooter(doc)
      const fileName = `Government_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.pdf`
      doc.save(fileName)
    } else if (format === 'csv') {
      const headers = data && data.length > 0 ? Object.keys(data[0]) : []
      const csvRows = [
        ['School Feeding Program - Government Report'],
        [`Report Type: ${reportType}`],
        [`Generated: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`],
        [],
        [headers.join(',')]
      ]

      if (data) {
        data.forEach((row: any) => {
          csvRows.push([headers.map(key => String(row[key] || '')).join(',')])
        })
      }

      const csvContent = csvRows.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `Government_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    return true
  } catch (error) {
    console.error('Error generating government report:', error)
    throw error
  }
}

// School Report Generation
export const generateSchoolReport = async (
  reportType: string,
  dateRange: { from?: Date; to?: Date },
  format: 'pdf' | 'csv' | 'excel',
  data: any,
  schoolInfo?: {
    school?: string
    province?: string
    district?: string
  }
) => {
  try {
    const userInfo = getCurrentUserInfo()
    const finalSchoolInfo = {
      school: schoolInfo?.school || userInfo?.schoolName || "N/A",
      province: schoolInfo?.province || userInfo?.province || "N/A",
      district: schoolInfo?.district || userInfo?.districtName || "N/A",
    }

    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPos = await addReportHeader(doc, `${reportType} Report`, {
        type: 'school',
        entityInfo: {
          name: finalSchoolInfo.school,
          province: finalSchoolInfo.province,
          district: finalSchoolInfo.district,
        },
        dateFrom: dateRange.from,
        dateTo: dateRange.to
      })

      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const tableData = data.map((row: any) => headers.map((key) => String(row[key] ?? '')))

        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: yPos,
          styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0]
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.1
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            lineColor: [0, 0, 0],
            lineWidth: 0.1
          },
          margin: { left: 15, right: 15 }
        })
      }

      addReportFooter(doc)
      const fileName = `School_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.pdf`
      doc.save(fileName)
    } else if (format === 'csv') {
      const headers = data && data.length > 0 ? Object.keys(data[0]) : []
      const csvRows = [
        ['School Feeding Program - School Management Report'],
        [`Report Type: ${reportType}`],
        [`Generated: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`],
        [],
        [headers.join(',')]
      ]

      if (data) {
        data.forEach((row: any) => {
          csvRows.push([headers.map(key => String(row[key] || '')).join(',')])
        })
      }

      const csvContent = csvRows.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `School_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    return true
  } catch (error) {
    console.error('Error generating school report:', error)
    throw error
  }
}
// Generate Invoice PDF
export const generateInvoice = async (
  delivery: any,
  options: {
    supplierName: string
    province?: string
    district?: string
  }
) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const reportTitle = 'DELIVERY INVOICE'

    // Add header
    let yPos = await addReportHeader(doc, reportTitle, {
      type: 'supplier',
      entityInfo: {
        supplierName: options.supplierName,
        province: options.province,
        district: options.district,
      }
    })

    // Invoice Info Section
    doc.setFontSize(10)
    doc.setFont('times', 'bold')
    doc.text(`Invoice ID: INV-${delivery.id?.substring(0, 8).toUpperCase()}`, 20, yPos)
    yPos += 7
    doc.text(`Delivery ID: ${delivery.id?.substring(0, 8)}`, 20, yPos)
    yPos += 7
    doc.text(`School: ${delivery.school}`, 20, yPos)
    yPos += 7
    doc.text(`Date: ${formatDate(new Date(), 'dd MMMM yyyy')}`, 20, yPos)
    yPos += 12

    // Prepare table data
    const headers = [['Item Name', 'Quantity']]

    // In a real app, unit price might come from the item object. 
    // Here we'll estimated if orderPrice exists, or just show the total.
    const tableData = delivery.items.map((item: string, index: number) => {
      const qty = delivery.quantities[index]
      return [item, qty]
    })

    // Add total row
    tableData.push([{ content: 'Total Order Price:', styles: { halign: 'right', fontStyle: 'bold' } },
    { content: new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(delivery.orderPrice), styles: { fontStyle: 'bold' } }])

    autoTable(doc, {
      head: headers,
      body: tableData,
      startY: yPos,
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      margin: { left: 20, right: 20 }
    })

    // Add Footer
    addReportFooter(doc)

    // Save
    doc.save(`Invoice_${delivery.school.replace(/\s+/g, '_')}_${delivery.id.substring(0, 8)}.pdf`)
    return true
  } catch (error) {
    console.error('Error generating invoice:', error)
    throw error
  }
}
