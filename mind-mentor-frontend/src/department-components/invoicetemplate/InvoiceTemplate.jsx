import React, { useState } from "react";
import { Download, Edit3, Plus, Trash2 } from "lucide-react";

import mindmentorzLogo from '../../assets/mindmentorz.png';

const InvoiceTemplate = () => {
  const [invoiceData, setInvoiceData] = useState({
    companyName: "Franchise Mind Mentorz Private Limited",
    address: "#54, First Floor, Hennur Bagalur Main Rd,",
    city: "Bengaluru, Karnataka 560077",
    country: "India",
    gstin: "29AAFCF0002M1ZT",
    invoiceNumber: "MM-5950",
    balanceDue: "₹ 0.00",
    billToName: "Praveen Naini",
    billToAddress: "C/O Kartikeya Reddy Naini",
    billToCity: "Singapore, , , , ,",
    placeOfSupply: "Karnataka (29)",
    invoiceDate: "21-May-2025 12:10:09",
    terms: "Due On Receipt",
    dueDate: "21-May-2025 12:10:09",
    paymentMode: "Razorpay",
    logoUrl: "", // For uploaded logo
    items: [
      {
        id: 1,
        description: "Coaching Sessions (16)",
        expiry: "21-Jul-2025",
        qty: 1,
        hsn: "999299",
        price: 4600.0,
        gst: 828.0,
        amount: 5428.0,
      },
    ],
    cgst: 414.0,
    sgst: 414.0,
    igst: 0.0,
    totalGst: 828.0,
    notes: "Thanks for your business.",
    paymentReceived: "The payment for this invoice has been received.",
  });

  const [editMode, setEditMode] = useState({});

  const handleEdit = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInvoiceData((prev) => ({
          ...prev,
          logoUrl: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setInvoiceData((prev) => ({
      ...prev,
      logoUrl: "",
    }));
  };

  const recalculateGST = (items) => {
    const totalGst = items.reduce((sum, item) => sum + (item.gst || 0), 0);
    setInvoiceData((prev) => ({
      ...prev,
      items,
      cgst: totalGst / 2,
      sgst: totalGst / 2,
      totalGst,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][field] = value;

    if (field === "price" || field === "qty") {
      const price = parseFloat(updatedItems[index].price) || 0;
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const baseAmount = price * qty;
      const gst = baseAmount * 0.18;
      updatedItems[index].gst = gst;
      updatedItems[index].amount = baseAmount + gst;

      recalculateGST(updatedItems);
    } else {
      setInvoiceData((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    }
  };

  const addItem = () => {
    const newItem = {
      id: invoiceData.items.length + 1,
      description: "New Item",
      expiry: "DD-MMM-YYYY",
      qty: 1,
      hsn: "000000",
      price: 0.0,
      gst: 0.0,
      amount: 0.0,
    };
    const updatedItems = [...invoiceData.items, newItem];
    recalculateGST(updatedItems);
  };

  const removeItem = (index) => {
    if (invoiceData.items.length > 1) {
      const updatedItems = invoiceData.items.filter((_, i) => i !== index);
      // Renumber items
      updatedItems.forEach((item, i) => {
        item.id = i + 1;
      });
      recalculateGST(updatedItems);
    }
  };

  const downloadInvoice = () => {
    // Create a proper PDF-ready HTML with exact styling
    const logoHtml = invoiceData.logoUrl
      ? `<img src="${invoiceData.logoUrl}" alt="MindMentorz Logo" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px;">`
      : `<div style="width: 50px; height: 50px; margin-right: 10px; background: linear-gradient(45deg, #FF8C00, #8B4513); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">LOGO</div>`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoiceData.invoiceNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            font-size: 11px; 
            line-height: 1.3;
            color: #000;
            background: #fff;
            padding: 20px;
        }
        .invoice-container { 
            max-width: 210mm; 
            margin: 0 auto; 
            background: white;
        }
        .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 15px;
        }
        .logo-section { 
            flex: 1; 
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }
        .logo { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 5px;
            color: #FF8C00;
        }
        .logo .mi { color: #FF8C00; }
        .logo .nd { color: #8B4513; }
        .logo .mentor { color: #FF8C00; }
        .logo .z { color: #8B4513; }
        .tagline { 
            font-size: 10px; 
            color: #8B4513; 
            margin-bottom: 15px;
        }
        .company-details { font-size: 11px; line-height: 1.4; }
        .company-name { font-weight: bold; margin-bottom: 8px; }
        .invoice-title { 
            text-align: right; 
            flex-shrink: 0;
        }
        .invoice-title h1 { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;
        }
        .invoice-details { font-size: 11px; }
        .bill-section { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 40px; 
            margin-bottom: 20px;
        }
        .bill-to h3, .invoice-info h3 { 
            font-weight: bold; 
            margin-bottom: 8px; 
            font-size: 12px;
        }
        .invoice-info { text-align: left; }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 15px;
            font-size: 10px;
        }
        th, td { 
            border: 1px solid #666; 
            padding: 6px 4px; 
            text-align: left;
        }
        th { 
            background-color: #e8e8e8; 
            font-weight: bold;
            text-align: center;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .gst-table { 
            width: 200px; 
            float: right; 
            margin-bottom: 20px;
        }
        .gst-table th { background-color: #e8e8e8; }
        .notes { margin-bottom: 15px; }
        .notes h3 { font-weight: bold; margin-bottom: 5px; }
        .terms { margin-bottom: 15px; }
        .terms h3 { font-weight: bold; margin-bottom: 5px; }
        .terms-content { font-size: 10px; line-height: 1.3; }
        .footer { 
            text-align: center; 
            font-size: 10px; 
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: 20px;
        }
        .amount-column { font-weight: bold; }
        hr.dashed { border: none; border-top: 1px dashed #666; margin: 3px 0; }
        @media print {
            body { margin: 0; padding: 15px; }
            .invoice-container { max-width: none; }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="logo-section">
                ${logoHtml}
                <div>
                    <div class="logo">
                        <span class="mi">Mi</span><span class="nd">ND</span><span class="mentor">MENTOR</span><span class="z">z</span>
                    </div>
                    <div class="tagline">Chess . Code . Rubik's . Robotics</div>
                    <div class="company-details">
                        <div class="company-name">${
                          invoiceData.companyName
                        }</div>
                        <div>${invoiceData.address}</div>
                        <div>${invoiceData.city}</div>
                        <div>${invoiceData.country}</div>
                        <br>
                        <div>GSTIN ${invoiceData.gstin}</div>
                    </div>
                </div>
            </div>
            <div class="invoice-title">
                <h1>TAX INVOICE</h1>
                <div class="invoice-details">
                    <div>Invoice #${invoiceData.invoiceNumber}</div>
                    <div>Balance Due : ${invoiceData.balanceDue}</div>
                </div>
            </div>
        </div>

        <div class="bill-section">
            <div class="bill-to">
                <h3>Bill To</h3>
                <div><strong>${invoiceData.billToName}</strong></div>
                <div>${invoiceData.billToAddress}</div>
                <div>${invoiceData.billToCity}</div>
                <br>
                <div>Place of supply: ${invoiceData.placeOfSupply}</div>
            </div>
            <div class="invoice-info">
                <div><strong>Invoice Date</strong> : ${
                  invoiceData.invoiceDate
                }</div>
                <div><strong>Terms</strong> : ${invoiceData.terms}</div>
                <div><strong>Due Date</strong> : ${invoiceData.dueDate}</div>
                <div><strong>Payment Mode</strong> : ${
                  invoiceData.paymentMode
                }</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 30px;">#</th>
                    <th>Item and Description</th>
                    <th style="width: 40px;">Qty</th>
                    <th style="width: 60px;">HSN</th>
                    <th style="width: 80px;">Price</th>
                    <th style="width: 80px;">GST (18%)</th>
                    <th style="width: 90px;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items
                  .map(
                    (item) => `
                <tr>
                    <td class="text-center">${item.id}</td>
                    <td>
                        ${item.description}
                        <br><small style="color: #666;">Expiry Date: ${
                          item.expiry
                        }</small>
                    </td>
                    <td class="text-center">${item.qty}</td>
                    <td class="text-center">${item.hsn}</td>
                    <td class="text-right">₹ ${item.price.toFixed(2)}</td>
                    <td class="text-right">₹ ${item.gst.toFixed(2)}</td>
                    <td class="text-right amount-column">₹ ${item.amount.toFixed(
                      2
                    )}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>

        <table class="gst-table">
            <thead>
                <tr>
                    <th>GST Breakup</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>CGST (9%)</td><td class="text-right">₹ ${invoiceData.cgst.toFixed(
                  2
                )}</td></tr>
                <tr><td>SGST (9%)</td><td class="text-right">₹ ${invoiceData.sgst.toFixed(
                  2
                )}</td></tr>
                <tr><td>IGST (9%)</td><td class="text-right">₹ ${invoiceData.igst.toFixed(
                  2
                )}</td></tr>
                <tr style="background-color: #f0f0f0;"><td><strong>Total</strong></td><td class="text-right"><strong>₹ ${invoiceData.totalGst.toFixed(
                  2
                )}</strong></td></tr>
            </tbody>
        </table>

        <div style="clear: both;"></div>

        <div class="notes">
            <h3>Notes</h3>
            <div>${invoiceData.notes}</div>
            <div>${invoiceData.paymentReceived}</div>
        </div>

        <div class="terms">
            <h3>Terms & Conditions</h3>
            <div class="terms-content">
                <strong>Coach Leave & Substitution:</strong>
                <hr class="dashed">
                When the coach is unable to take a class, the class is either cancelled and the class gets rolled over<br>
                or<br>
                A substitute coach will be provided for the session<br>
                or<br>
                A temporary slot is made available for the particular day
            </div>
        </div>

        <div class="footer">
            This is a computer generated invoice
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${invoiceData.invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Also trigger print dialog for PDF
    const printWindow = window.open("", "_blank");
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const EditableField = ({
    value,
    field,
    type = "text",
    className = "",
    style = {},
  }) => (
    <div className="relative group inline-block">
      {editMode[field] ? (
        <input
          type={type}
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          onBlur={() => handleEdit(field)}
          onKeyPress={(e) => e.key === "Enter" && handleEdit(field)}
          className="bg-blue-50 border border-blue-300 rounded px-1 py-0 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
          style={style}
          autoFocus
        />
      ) : (
        <span
          className={`cursor-pointer hover:bg-gray-100 px-1 rounded text-xs ${className}`}
          onClick={() => handleEdit(field)}
          style={style}
        >
          {value}
          <Edit3 className="inline ml-1 w-2 h-2 opacity-0 group-hover:opacity-50 transition-opacity" />
        </span>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Fixed Header with Logo Upload and Download Button */}
      <div className="bg-white shadow-sm border-b px-4 py-2 flex justify-between items-center flex-shrink-0">
        <h1 className="text-lg font-semibold text-gray-800">Invoice Editor</h1>
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            📷 Upload Logo
          </label>
          {invoiceData.logoUrl && (
            <button
              onClick={removeLogo}
              className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              title="Remove Logo"
            >
              ✕
            </button>
          )}
          <button
            onClick={downloadInvoice}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            <Download className="w-3 h-3" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Scrollable Invoice Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg">
          <div id="invoice-content" className="p-6 text-xs">
            {/* Header with MindMentorz Logo */}
            <div className="flex justify-between items-start mb-4 border-b-2 border-gray-200 pb-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  {/* Logo Display - Multiple Options */}
                  <div className="flex-shrink-0">
                    {/* Option 1: Direct import (uncomment when you add logo to src/assets/) */}
                    {/* 
                    <img 
                      src={mindmentorzLogo} 
                      alt="MindMentorz Logo" 
                      className="w-12 h-12 object-contain"
                    />
                    */}

                    {/* Option 2: Upload functionality (currently active) */}
                    {invoiceData.logoUrl ? (
                      <img
                        src={invoiceData.logoUrl}
                        alt="MindMentorz Logo"
                        className="w-12 h-12 object-contain rounded border"
                        onError={(e) => {
                          console.error("Logo failed to load");
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      /* Option 3: Base64 encoded image (replace YOUR_BASE64_DATA) */
                      /* To use: convert your PNG to base64 and uncomment:
                      <img 
                        src="data:image/png;base64,YOUR_BASE64_DATA" 
                        alt="MindMentorz Logo" 
                        className="w-12 h-12 object-contain"
                      />
                      */

                      // SVG Fallback (when no image is uploaded)
                      <svg width="40" height="40" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient
                            id="orangeGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "#FF8C00", stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: "#FFA500", stopOpacity: 1 }}
                            />
                          </linearGradient>
                          <linearGradient
                            id="purpleGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "#8B4513", stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: "#A0522D", stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="35" r="8" fill="url(#orangeGrad)" />
                        <rect
                          x="46"
                          y="42"
                          width="8"
                          height="3"
                          rx="1"
                          fill="url(#orangeGrad)"
                        />
                        <rect
                          x="35"
                          y="48"
                          width="30"
                          height="4"
                          rx="2"
                          fill="url(#purpleGrad)"
                        />
                        <polygon
                          points="30,55 35,65 40,55"
                          fill="url(#orangeGrad)"
                        />
                        <polygon
                          points="60,55 65,65 70,55"
                          fill="url(#orangeGrad)"
                        />
                        <rect
                          x="42"
                          y="60"
                          width="16"
                          height="8"
                          rx="4"
                          fill="url(#purpleGrad)"
                        />
                        <circle cx="46" cy="64" r="1.5" fill="white" />
                        <circle cx="54" cy="64" r="1.5" fill="white" />
                        <path
                          d="M 40 75 Q 50 85 60 75"
                          stroke="url(#orangeGrad)"
                          strokeWidth="2"
                          fill="none"
                        />
                        <rect
                          x="20"
                          y="20"
                          width="60"
                          height="60"
                          rx="8"
                          fill="none"
                          stroke="url(#purpleGrad)"
                          strokeWidth="1.5"
                          strokeDasharray="3,2"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      <span style={{ color: "#FF8C00" }}>Mi</span>
                      <span style={{ color: "#8B4513" }}>ND</span>
                      <span style={{ color: "#FF8C00" }}>MENTOR</span>
                      <span style={{ color: "#8B4513" }}>z</span>
                    </div>
                    <div className="text-xs" style={{ color: "#8B4513" }}>
                      Chess . Code . Rubik's . Robotics
                    </div>
                  </div>
                </div>
                <div className="space-y-0.5 mt-3">
                  <EditableField
                    value={invoiceData.companyName}
                    field="companyName"
                    className="font-semibold block"
                  />
                  <EditableField
                    value={invoiceData.address}
                    field="address"
                    className="block"
                  />
                  <EditableField
                    value={invoiceData.city}
                    field="city"
                    className="block"
                  />
                  <EditableField
                    value={invoiceData.country}
                    field="country"
                    className="block"
                  />
                  <div className="mt-2">
                    <span className="text-xs">GSTIN </span>
                    <EditableField
                      value={invoiceData.gstin}
                      field="gstin"
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold mb-2">TAX INVOICE</h1>
                <div className="text-xs space-y-1">
                  <div>
                    Invoice #
                    <EditableField
                      value={invoiceData.invoiceNumber}
                      field="invoiceNumber"
                      className="font-semibold"
                    />
                  </div>
                  <div>
                    Balance Due :{" "}
                    <EditableField
                      value={invoiceData.balanceDue}
                      field="balanceDue"
                      className="font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To and Invoice Details */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <h3 className="font-semibold mb-2 text-xs">Bill To</h3>
                <div className="space-y-0.5">
                  <EditableField
                    value={invoiceData.billToName}
                    field="billToName"
                    className="block font-semibold"
                  />
                  <EditableField
                    value={invoiceData.billToAddress}
                    field="billToAddress"
                    className="block"
                  />
                  <EditableField
                    value={invoiceData.billToCity}
                    field="billToCity"
                    className="block"
                  />
                </div>
                <div className="mt-2">
                  <span>Place of supply: </span>
                  <EditableField
                    value={invoiceData.placeOfSupply}
                    field="placeOfSupply"
                  />
                </div>
              </div>
              <div className="text-left space-y-1">
                <div>
                  <span className="font-medium">Invoice Date</span> :{" "}
                  <EditableField
                    value={invoiceData.invoiceDate}
                    field="invoiceDate"
                  />
                </div>
                <div>
                  <span className="font-medium">Terms</span> :{" "}
                  <EditableField value={invoiceData.terms} field="terms" />
                </div>
                <div>
                  <span className="font-medium">Due Date</span> :{" "}
                  <EditableField value={invoiceData.dueDate} field="dueDate" />
                </div>
                <div>
                  <span className="font-medium">Payment Mode</span> :{" "}
                  <EditableField
                    value={invoiceData.paymentMode}
                    field="paymentMode"
                  />
                </div>
              </div>
            </div>

            {/* Items Table with Add/Delete Buttons */}
            <div className="mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 p-1 text-left w-8">
                      #
                    </th>
                    <th className="border border-gray-400 p-1 text-left">
                      Item and Description
                    </th>
                    <th className="border border-gray-400 p-1 text-center w-12">
                      Qty
                    </th>
                    <th className="border border-gray-400 p-1 text-center w-16">
                      HSN
                    </th>
                    <th className="border border-gray-400 p-1 text-right w-20">
                      Price
                    </th>
                    <th className="border border-gray-400 p-1 text-right w-20">
                      GST (18%)
                    </th>
                    <th className="border border-gray-400 p-1 text-right w-24">
                      Amount
                    </th>
                    <th className="border border-gray-400 p-1 text-center w-16">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-gray-400 p-1 text-center">
                        {item.id}
                      </td>
                      <td className="border border-gray-400 p-1">
                        <div className="relative group">
                          {editMode[`item-${index}-description`] ? (
                            <input
                              value={item.description}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                handleEdit(`item-${index}-description`)
                              }
                              className="w-full bg-blue-50 border border-blue-300 rounded px-1 py-0 text-xs"
                              autoFocus
                            />
                          ) : (
                            <div
                              className="cursor-pointer hover:bg-gray-100 px-1 rounded text-xs"
                              onClick={() =>
                                handleEdit(`item-${index}-description`)
                              }
                            >
                              {item.description}
                              <Edit3 className="inline ml-1 w-2 h-2 opacity-0 group-hover:opacity-50" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Expiry Date:
                          <div className="relative group inline">
                            {editMode[`item-${index}-expiry`] ? (
                              <input
                                value={item.expiry}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "expiry",
                                    e.target.value
                                  )
                                }
                                onBlur={() =>
                                  handleEdit(`item-${index}-expiry`)
                                }
                                className="bg-blue-50 border border-blue-300 rounded px-1 ml-1 text-xs"
                                autoFocus
                              />
                            ) : (
                              <span
                                className="cursor-pointer hover:bg-gray-100 px-1 rounded ml-1 text-xs"
                                onClick={() =>
                                  handleEdit(`item-${index}-expiry`)
                                }
                              >
                                {item.expiry}
                                <Edit3 className="inline ml-1 w-2 h-2 opacity-0 group-hover:opacity-50" />
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-400 p-1 text-center">
                        <div className="relative group">
                          {editMode[`item-${index}-qty`] ? (
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "qty",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onBlur={() => handleEdit(`item-${index}-qty`)}
                              className="w-full bg-blue-50 border border-blue-300 rounded px-1 py-0 text-center text-xs"
                              autoFocus
                            />
                          ) : (
                            <span
                              className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded block text-xs"
                              onClick={() => handleEdit(`item-${index}-qty`)}
                            >
                              {item.qty}
                              <Edit3 className="inline ml-1 w-2 h-2 opacity-0 group-hover:opacity-50" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-400 p-1 text-center">
                        <div className="relative group">
                          {editMode[`item-${index}-hsn`] ? (
                            <input
                              value={item.hsn}
                              onChange={(e) =>
                                handleItemChange(index, "hsn", e.target.value)
                              }
                              onBlur={() => handleEdit(`item-${index}-hsn`)}
                              className="w-full bg-blue-50 border border-blue-300 rounded px-1 py-0 text-center text-xs"
                              autoFocus
                            />
                          ) : (
                            <span
                              className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded block text-xs"
                              onClick={() => handleEdit(`item-${index}-hsn`)}
                            >
                              {item.hsn}
                              <Edit3 className="inline ml-1 w-2 h-2 opacity-0 group-hover:opacity-50" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-400 p-1 text-right">
                        <div className="relative group">
                          {editMode[`item-${index}-price`] ? (
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onBlur={() => handleEdit(`item-${index}-price`)}
                              className="w-full bg-blue-50 border border-blue-300 rounded px-1 py-0 text-right text-xs"
                              autoFocus
                            />
                          ) : (
                            <span
                              className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded block text-xs"
                              onClick={() => handleEdit(`item-${index}-price`)}
                            >
                              ₹ {item.price.toFixed(2)}
                              <Edit3 className="inline ml-1 w-2 h-2 opacity-0 group-hover:opacity-50" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-400 p-1 text-right text-xs">
                        ₹ {item.gst.toFixed(2)}
                      </td>
                      <td className="border border-gray-400 p-1 text-right text-xs font-semibold">
                        ₹ {item.amount.toFixed(2)}
                      </td>
                      <td className="border border-gray-400 p-1 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={addItem}
                            className="text-green-600 hover:text-green-800 hover:bg-green-50 p-0.5 rounded"
                            title="Add new item"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          {invoiceData.items.length > 1 && (
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-0.5 rounded"
                              title="Remove this item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GST Breakdown */}
            <div className="flex justify-end mb-4">
              <table className="w-48 text-xs">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 p-1 text-left font-semibold">
                      GST Breakup
                    </th>
                    <th className="border border-gray-400 p-1 text-right font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-400 p-1">CGST (9%)</td>
                    <td className="border border-gray-400 p-1 text-right">
                      ₹ {invoiceData.cgst.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1">SGST (9%)</td>
                    <td className="border border-gray-400 p-1 text-right">
                      ₹ {invoiceData.sgst.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1">IGST (9%)</td>
                    <td className="border border-gray-400 p-1 text-right">
                      ₹ {invoiceData.igst.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-semibold">
                    <td className="border border-gray-400 p-1">Total</td>
                    <td className="border border-gray-400 p-1 text-right">
                      ₹ {invoiceData.totalGst.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes */}
            <div className="mb-3">
              <h3 className="font-semibold mb-1 text-xs">Notes</h3>
              <div className="space-y-1">
                <EditableField
                  value={invoiceData.notes}
                  field="notes"
                  className="block"
                />
                <EditableField
                  value={invoiceData.paymentReceived}
                  field="paymentReceived"
                  className="block"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-3">
              <h3 className="font-semibold mb-1 text-xs">Terms & Conditions</h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p className="font-semibold">Coach Leave & Substitution:</p>
                <hr className="border-dashed border-gray-400 my-1" />
                <p>
                  When the coach is unable to take a class, the class is either
                  cancelled and the class gets rolled over
                </p>
                <p>or</p>
                <p>A substitute coach will be provided for the session</p>
                <p>or</p>
                <p>A temporary slot is made available for the particular day</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t pt-2">
              This is a computer generated invoice
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
