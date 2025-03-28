const scriptURL = "https://script.google.com/macros/s/AKfycbwGzkYr-sDq_JIEwf12dnBMDvHRt2dU2LmNwVsd2W2Zl0d7WQX4FEjckRnnFilPyL7F_w/exec";

document.getElementById('payrollForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        employeeId: document.getElementById('employeeId').value,
        employeeName: document.getElementById('employeeName').value,
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value,
        overtime: document.getElementById('overtime').value,
        deductions: document.getElementById('deductions').value,
        baseSalary: document.getElementById('baseSalary').value,
        finalSalary: calculateSalary()
    };

    // Send data to Google Sheets
    const response = await fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('Payment slip saved successfully! Generating PDF...');

        // Generate PDF
        generatePDF(data);
    } else {
        alert('Error saving data!');
    }
});

function calculateSalary() {
    const base = parseFloat(document.getElementById('baseSalary').value);
    const overtime = parseFloat(document.getElementById('overtime').value) * 150;
    const deductions = parseFloat(document.getElementById('deductions').value);
    return base + overtime - deductions;
}

function generatePDF(data) {
    const pdfContainer = document.getElementById('pdfContainer');
    pdfContainer.innerHTML = `
        <div id="pdfContent" style="padding: 20px; font-family: Arial; line-height: 1.6;">
            <h2>Payment Slip</h2>
            <p><strong>Employee ID:</strong> ${data.employeeId}</p>
            <p><strong>Employee Name:</strong> ${data.employeeName}</p>
            <p><strong>Check-In:</strong> ${data.checkIn}</p>
            <p><strong>Check-Out:</strong> ${data.checkOut}</p>
            <p><strong>Overtime:</strong> ${data.overtime} hrs</p>
            <p><strong>Deductions:</strong> ₹${data.deductions}</p>
            <p><strong>Base Salary:</strong> ₹${data.baseSalary}</p>
            <p><strong>Final Salary:</strong> ₹${data.finalSalary}</p>
        </div>
    `;

    const element = document.getElementById('pdfContent');

    // Use html2pdf library to generate PDF
    html2pdf().from(element).save(`PaymentSlip_${data.employeeId}.pdf`);
}
