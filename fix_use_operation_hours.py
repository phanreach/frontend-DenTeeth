import re

with open("src/dentist/hooks/use-operation-hours.ts", "r") as f:
    content = f.read()

robust_return = """ const response = await getOperationHoursApi(dentistId);
 const rawData = response.data;
 if (Array.isArray(rawData)) return rawData;
 if (rawData && Array.isArray(rawData.data)) return rawData.data;
 if (rawData && rawData.data && Array.isArray(rawData.data.hours)) return rawData.data.hours;
 if (rawData && rawData.data && Array.isArray(rawData.data.operationHours)) return rawData.data.operationHours;
 return rawData;"""

content = re.sub(
    r'const response = await getOperationHoursApi\(dentistId\);\n\s*return response\.data\.data;',
    robust_return,
    content
)

with open("src/dentist/hooks/use-operation-hours.ts", "w") as f:
    f.write(content)

