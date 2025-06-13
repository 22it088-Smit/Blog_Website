const ExcelJS = require("exceljs")
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx")
const moment = require("moment")
const ExportUtils = require("../utils/exportUtils")

/**
 * Service class for exporting data
 */
class ExportService {
  /**
   * Export blog to Excel
   * @param {Object} blog - Blog object
   * @returns {Buffer} - Excel file buffer
   */
  async exportBlogToExcel(blog) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Blog Post")

    // Add headers and styling
    worksheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Author", key: "author", width: 20 },
      { header: "Category", key: "category", width: 15 },
      { header: "Tags", key: "tags", width: 30 },
      { header: "Date", key: "date", width: 15 },
      { header: "Content", key: "content", width: 100 },
    ]

    // Style the header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    }

    // Add data
    worksheet.addRow({
      title: blog.title,
      author: blog.author.name,
      category: blog.category,
      tags: blog.tags.join(", "),
      date: moment(blog.createdAt).format("YYYY-MM-DD"),
      content: blog.content.replace(/<[^>]*>?/gm, ""), // Remove HTML tags
    })

    // Auto fit columns
    worksheet.columns.forEach((column) => {
      column.width = column.width
    })

    // Return as buffer
    return await workbook.xlsx.writeBuffer()
  }

  /**
   * Export blog to Word
   * @param {Object} blog - Blog object
   * @returns {Buffer} - Word document buffer
   */
  async exportBlogToWord(blog) {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: blog.title,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Author: ${blog.author.name}`,
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Category: ${blog.category}`,
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Tags: ${blog.tags.join(", ")}`,
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date: ${moment(blog.createdAt).format("MMMM D, YYYY")}`,
                  italics: true,
                }),
              ],
            }),
            new Paragraph({}), // Empty paragraph for spacing
            new Paragraph({
              text: blog.content.replace(/<[^>]*>?/gm, ""), // Remove HTML tags
            }),
          ],
        },
      ],
    })

    // Return as buffer
    return await Packer.toBuffer(doc)
  }
}

module.exports = new ExportService()
