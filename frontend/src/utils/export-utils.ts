import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format as formatDate } from 'date-fns'

// Helper function to add header with logo and title
const addReportHeader = (doc: jsPDF, title: string, subtitle?: string) => {
  // Header background
  doc.setFillColor(34, 139, 34) // Green color for School Feeding
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F')
  
  // Try to add logo (if available)
  try {
    // You can add an image here if you have a logo file
    // For now, we'll add a text-based logo
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('🍎 School Feeding Program', 20, 15)
  } catch (error) {
    // If logo fails, just use text
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('School Feeding Program', 20, 15)
  }
  
  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 20, 30)
  
  // Subtitle if provided
  if (subtitle) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(subtitle, 20, 37)
  }
  
  // Reset text color
  doc.setTextColor(0, 0, 0)
  
  return 45 // Return Y position after header
}

interface SchoolInfo {
  name?: string
  id?: string
  district?: string
  community?: string
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


    // Add header with logo and School Feeding
    let yPos = addReportHeader(doc, 'Annex 3: Food Tracking Sheet', 'This sheet should be filled separately for each food item, and for each month.')
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    // School Information Section
    doc.setFont('helvetica', 'bold')
    doc.text('Name of school:', 10, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(schoolInfo.name || 'N/A', 50, yPos)

    doc.setFont('helvetica', 'bold')
    doc.text('Community:', 10, yPos + 6)
    doc.setFont('helvetica', 'normal')
    doc.text(schoolInfo.community || 'N/A', 50, yPos + 6)

    doc.setFont('helvetica', 'bold')
    doc.text('School ID:', 10, yPos + 12)
    doc.setFont('helvetica', 'normal')
    doc.text(schoolInfo.id || 'N/A', 50, yPos + 12)

    doc.setFont('helvetica', 'bold')
    doc.text('Food item:', 150, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(foodItem.name || 'N/A', 180, yPos)

    doc.setFont('helvetica', 'bold')
    doc.text('District:', 150, yPos + 6)
    doc.setFont('helvetica', 'normal')
    doc.text(schoolInfo.district || 'N/A', 180, yPos + 6)

    doc.setFont('helvetica', 'bold')
    doc.text('Month / Year:', 150, yPos + 12)
    doc.setFont('helvetica', 'normal')
    doc.text(monthYear, 180, yPos + 12)

    yPos += 20

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

    // Create table with custom styling
    autoTable(doc, {
      head: headers,
      body: tableData,
      startY: yPos,
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7
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
        fillColor: [245, 245, 245]
      },
      margin: { top: yPos, left: 10, right: 10 }
    })

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
  data: any
) => {
  try {
    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPos = addReportHeader(doc, 'Stock Management Report', reportType)
      
      // Report metadata
      doc.setFontSize(10)
      doc.text(`Report Type: ${reportType}`, 20, yPos)
      yPos += 6
      
      if (dateRange.from && dateRange.to) {
        doc.text(`Period: ${formatDate(dateRange.from, 'dd/MM/yyyy')} - ${formatDate(dateRange.to, 'dd/MM/yyyy')}`, 20, yPos)
        yPos += 6
      }
      
      doc.text(`Generated: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, yPos)
      yPos += 10

      // Add data table
      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const tableData = data.map((row: any) => headers.map((key) => String(row[key] || '')))
        
        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: yPos,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [34, 139, 34] }
        })
      }

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
  data: any
) => {
  try {
    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPos = addReportHeader(doc, 'Supplier Report', reportType)
      
      doc.setFontSize(10)
      doc.text(`Report Type: ${reportType}`, 20, yPos)
      yPos += 6
      
      if (dateRange.from && dateRange.to) {
        doc.text(`Period: ${formatDate(dateRange.from, 'dd/MM/yyyy')} - ${formatDate(dateRange.to, 'dd/MM/yyyy')}`, 20, yPos)
        yPos += 6
      }
      
      doc.text(`Generated: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, yPos)
      yPos += 10

      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const tableData = data.map((row: any) => headers.map((key) => String(row[key] || '')))
        
        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: yPos,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [34, 139, 34] }
        })
      }

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
  data: any
) => {
  try {
    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPos = addReportHeader(doc, 'District Report', reportType)
      
      doc.setFontSize(10)
      doc.text(`Report Type: ${reportType}`, 20, yPos)
      yPos += 6
      
      if (dateRange.from && dateRange.to) {
        doc.text(`Period: ${formatDate(dateRange.from, 'dd/MM/yyyy')} - ${formatDate(dateRange.to, 'dd/MM/yyyy')}`, 20, yPos)
        yPos += 6
      }
      
      doc.text(`Generated: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, yPos)
      yPos += 10

      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const tableData = data.map((row: any) => headers.map((key) => String(row[key] || '')))
        
        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: yPos,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [34, 139, 34] }
        })
      }

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

      let yPos = addReportHeader(doc, 'Government Report', reportType)
      
      doc.setFontSize(10)
      doc.text(`Report Type: ${reportType}`, 20, yPos)
      yPos += 6
      
      if (dateRange.from && dateRange.to) {
        doc.text(`Period: ${formatDate(dateRange.from, 'dd/MM/yyyy')} - ${formatDate(dateRange.to, 'dd/MM/yyyy')}`, 20, yPos)
        yPos += 6
      }
      
      doc.text(`Generated: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, yPos)
      yPos += 10

      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const tableData = data.map((row: any) => headers.map((key) => String(row[key] || '')))
        
        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: yPos,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [34, 139, 34] }
        })
      }

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

