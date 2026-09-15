from pathlib import Path
from openpyxl import load_workbook

PATH = Path('/home/ubuntu/deliverables/CivilDocs_90_Day_Revenue_and_Expense_Projection_2026-08-20.xlsx')
wb = load_workbook(PATH, data_only=True)
model = wb['Revenue and P&L']
checks = wb['Checks']

expected = {
    'Month 1 gross billings': (model['D19'].value, 796.0),
    'Month 2 gross billings': (model['E19'].value, 1593.0),
    'Month 3 gross billings': (model['F19'].value, 3888.0),
    '90-day gross billings': (model['D36'].value, 6277.0),
    '90-day cash operating expenses': (model['D37'].value, 8225.945),
    '90-day cash operating profit/loss': (model['D38'].value, -1948.945),
    'Month 3 profit/loss': (model['F32'].value, 1451.92),
    'Month 3 paid-seat equivalent': (model['D40'].value, 16.0),
    'Month 1 revenue check': (checks['D9'].value, 0.0),
    'Month 2 revenue check': (checks['D10'].value, 0.0),
    'Month 3 revenue check': (checks['D11'].value, 0.0),
    'Month 1 expense check': (checks['D12'].value, 0.0),
    'Month 2 expense check': (checks['D13'].value, 0.0),
    'Month 3 expense check': (checks['D14'].value, 0.0),
    '90-day profit/loss check': (checks['D15'].value, 0.0),
}

for label, (actual, target) in expected.items():
    if actual is None or abs(float(actual) - target) > 0.0001:
        raise SystemExit(f'FAILED: {label}: expected {target}, got {actual}')
    print(f'PASS: {label} = {actual}')
print('PASS: Financial model has recalculated revenue, expense, operating profit/loss, and formula checks.')

