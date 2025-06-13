const ExcelJS = require("exceljs")
const { Document, Packer, Paragraph, TextRun } = require("docx")
const fs = require("fs")
const path = require("path")

/**
 * Utility class for exporting data to different formats
 */
class ExportUtils {
  /**
   * Export data to Excel
   * @param {Array} data - Data to export
   * @param {string} filename - Output filename
   * @returns {Promise<Buffer>} - Excel file buffer
   */
  static async exportToExcel(data, filename) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Blog Post")

    // Add headers
    const headers = Object.keys(data)
    worksheet.addRow(headers)

    // Add data
    const values = Object.values(data)
    worksheet.addRow(values)

    // Style the header row
    worksheet.getRow(1).font = { bold: true }

    // Return as buffer
    return await workbook.xlsx.writeBuffer()
  }

  /**
   * Export data to Word document
   * @param {object} data - Data to export
   * @param {string} filename - Output filename
   * @returns {Promise<Buffer>} - Word document buffer
   */
  static async exportToWord(data, filename) {
    const doc = new Document()

    // Add title
    doc.addSection({
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: data.title,
              bold: true,
              size: 28,
            }),
          ],
        }),
        new Paragraph({
          text: "",
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Author: ${data.author}`,
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Date: ${data.date}`,
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          text: "",
        }),
        new Paragraph({
          text: data.content.replace(/<[^>]*>?/gm, ""), // Remove HTML tags
        }),
      ],
    })

    // Return as buffer
    return await Packer.toBuffer(doc)
  }
}

module.exports = ExportUtils
