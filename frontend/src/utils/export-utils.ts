import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format as formatDate } from 'date-fns'

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
  schoolInfo?: {
    school?: string
    province?: string
    district?: string
    dateFrom?: Date
    dateTo?: Date
  }
) => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  
  // Set light gray background for entire page
  doc.setFillColor(240, 240, 240) // Light gray
  doc.rect(0, 0, pageWidth, pageHeight, 'F')
  
  let yPos = 15

  // Add logo at top left (circular emblem)
  try {
    const logoBase64 = await loadImageAsBase64('/logo.svg')
    if (logoBase64) {
      // Add logo image - positioned at top left, size 30x30mm
      doc.addImage(logoBase64, 'SVG', 15, yPos, 30, 30)
    }
  } catch (error) {
    console.error('Error adding logo:', error)
    // Draw a placeholder circle if logo fails
    doc.setDrawColor(0, 128, 0) // Green
    doc.setFillColor(255, 255, 255) // White
    doc.circle(30, yPos + 15, 15, 'FD')
  }

  // Add "SCHOOL FEEDING" in blue, bold, capitalized below logo
  yPos += 35
  doc.setTextColor(0, 0, 255) // Blue color (RGB: 0, 0, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('SCHOOL FEEDING', 15, yPos)

  yPos += 10

  // Add information section with colored labels (matching picture exactly)
  if (schoolInfo) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')

    // School: (red label, black value)
    doc.setTextColor(255, 0, 0) // Red
    doc.text('School:', 15, yPos)
    doc.setTextColor(0, 0, 0) // Black
    const schoolX = 15 + doc.getTextWidth('School: ') + 2
    doc.text(schoolInfo.school || 'N/A', schoolX, yPos)

    // Province: (black)
    yPos += 7
    doc.setTextColor(0, 0, 0) // Black
    doc.text('Province:', 15, yPos)
    const provinceX = 15 + doc.getTextWidth('Province: ') + 2
    doc.text(schoolInfo.province || 'N/A', provinceX, yPos)

    // District: (orange label, black value)
    yPos += 7
    doc.setTextColor(255, 165, 0) // Orange (RGB: 255, 165, 0)
    doc.text('District:', 15, yPos)
    doc.setTextColor(0, 0, 0) // Black
    const districtX = 15 + doc.getTextWidth('District: ') + 2
    doc.text(schoolInfo.district || 'N/A', districtX, yPos)

    // Date range: From/To (red labels, black dates)
    if (schoolInfo.dateFrom && schoolInfo.dateTo) {
      yPos += 7
      doc.setTextColor(255, 0, 0) // Red
      doc.text('From:', 15, yPos)
      doc.setTextColor(0, 0, 0) // Black
      const fromDateX = 15 + doc.getTextWidth('From: ') + 2
      doc.text(formatDate(schoolInfo.dateFrom, 'dd MMMM yyyy'), fromDateX, yPos)
      
      yPos += 7
      doc.setTextColor(255, 0, 0) // Red
      doc.text('To:', 15, yPos)
      doc.setTextColor(0, 0, 0) // Black
      const toDateX = 15 + doc.getTextWidth('To: ') + 2
      doc.text(formatDate(schoolInfo.dateTo, 'dd MMMM yyyy'), toDateX, yPos)
      
      yPos += 12
    } else {
      yPos += 7
    }
  } else {
    yPos += 10
  }

  // Center the report title in blue, bold (replace "Title Report" with actual report type)
  yPos += 5
  doc.setTextColor(0, 0, 255) // Blue
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  const titleWidth = doc.getTextWidth(reportTitle)
  const titleX = (pageWidth - titleWidth) / 2
  doc.text(reportTitle, titleX, yPos)

  yPos += 12

  // Reset text color
  doc.setTextColor(0, 0, 0)

  return yPos // Return Y position after header
}

// Helper function to add footer with generator date (matching picture format)
const addReportFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(0, 0, 0) // Black text
  
  const footerText = `Generator on ${formatDate(new Date(), 'dd MMMM yyyy')}`
  const footerWidth = doc.getTextWidth(footerText)
  const footerX = pageWidth - footerWidth - 15 // Right aligned with margin
  const footerY = pageHeight - 12 // Bottom margin
  
  doc.text(footerText, footerX, footerY)
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
      school: schoolInfo.name,
      province: schoolInfo.province,
      district: schoolInfo.district,
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
        lineWidth: 0.5, // Thicker borders to match picture
        fillColor: [255, 255, 255], // White background for cells
        textColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [255, 255, 255], // White background
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7,
        lineColor: [0, 0, 0], // Black borders
        lineWidth: 0.5
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
        fillColor: [255, 255, 255], // White background
        lineColor: [0, 0, 0], // Black borders
        lineWidth: 0.5
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
    // In a production app, you might want to use a library like xlsx
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
    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Use reportType as the title (e.g., "Stock Management Report")
      let yPos = await addReportHeader(doc, `${reportType} Report`, {
        school: schoolInfo?.school,
        province: schoolInfo?.province,
        district: schoolInfo?.district,
        dateFrom: dateRange.from,
        dateTo: dateRange.to
      })
      
      // Add data table with black borders
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
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5, // Thicker borders to match picture
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0]
          },
          headStyles: { 
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255], // White background
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5
          },
          margin: { left: 15, right: 15 }
        })
      }

      // Add footer with generator date
      addReportFooter(doc)

      const fileName = `Stock_Report_${reportType.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd')}.pdf`
      doc.save(fileName)
    } else if (format === 'csv') {
      // CSV generation
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
    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Use reportType as the title (e.g., "Stock Management Report")
      let yPos = await addReportHeader(doc, `${reportType} Report`, {
        school: schoolInfo?.school,
        province: schoolInfo?.province,
        district: schoolInfo?.district,
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
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5, // Thicker borders to match picture
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0]
          },
          headStyles: { 
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255], // White background
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5
          },
          margin: { left: 15, right: 15 }
        })
      }

      // Add footer with generator date
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
    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Use reportType as the title (e.g., "Stock Management Report")
      let yPos = await addReportHeader(doc, `${reportType} Report`, {
        school: schoolInfo?.school,
        province: schoolInfo?.province,
        district: schoolInfo?.district,
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
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5, // Thicker borders to match picture
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0]
          },
          headStyles: { 
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255], // White background
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5
          },
          margin: { left: 15, right: 15 }
        })
      }

      // Add footer with generator date
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
  data: any,
  schoolInfo?: {
    school?: string
    province?: string
    district?: string
  }
) => {
  try {
    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Use reportType as the title (e.g., "Stock Management Report")
      let yPos = await addReportHeader(doc, `${reportType} Report`, {
        school: schoolInfo?.school,
        province: schoolInfo?.province,
        district: schoolInfo?.district,
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
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5, // Thicker borders to match picture
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0]
          },
          headStyles: { 
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255], // White background
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.5
          },
          margin: { left: 15, right: 15 }
        })
      }

      // Add footer with generator date
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

