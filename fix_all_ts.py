import re

# 1. api.ts
with open("src/api/api.ts", "r") as f:
    content = f.read()
content = content.replace("const data = error.response?.data as unknown;", "const data = error.response?.data as { message?: string };")
with open("src/api/api.ts", "w") as f:
    f.write(content)

# 2. service-modal.tsx
with open("src/components/dentist/service-modal.tsx", "r") as f:
    content = f.read()
content = content.replace("const handleFormSubmit = (data: unknown) => {", "const handleFormSubmit = (data: any) => {")
content = content.replace("toast.error(err.message ||", "toast.error((err as Error).message ||")
with open("src/components/dentist/service-modal.tsx", "w") as f:
    f.write(content)

# 3. appointments.tsx
with open("src/dentist/pages/appointments.tsx", "r") as f:
    content = f.read()
content = content.replace("status: item.status as unknown,", "status: item.status as any,")
with open("src/dentist/pages/appointments.tsx", "w") as f:
    f.write(content)

# 4. dashboard.tsx
with open("src/dentist/pages/dashboard.tsx", "r") as f:
    content = f.read()
content = content.replace("([date, statuses]: [string, Record<string, number>])", "([date, statuses]: any)")
content = content.replace("const topConditions = topServices.map((s: { serviceName: string; count: number } /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>", "const topConditions = topServices.map((s: any) =>")
with open("src/dentist/pages/dashboard.tsx", "w") as f:
    f.write(content)

print("TS Fixes Applied")
