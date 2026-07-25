import re

# 1. api.ts
with open("src/api/api.ts", "r") as f:
    content = f.read()
content = content.replace("as any;", "as unknown;")
with open("src/api/api.ts", "w") as f:
    f.write(content)

# 2. change-password-modal.tsx
with open("src/components/dentist/change-password-modal.tsx", "r") as f:
    content = f.read()
content = re.sub(r'async function onSubmit\(_data:\s*z\.infer<typeof formSchema>\)\s*\{', r'async function onSubmit() {', content)
with open("src/components/dentist/change-password-modal.tsx", "w") as f:
    f.write(content)

# 3. service-modal.tsx
with open("src/components/dentist/service-modal.tsx", "r") as f:
    content = f.read()
content = re.sub(r'const category =\s*watch\("category"\)\s*as\s*any;', r'const category = watch("category") as unknown;', content)
with open("src/components/dentist/service-modal.tsx", "w") as f:
    f.write(content)

# 4. appointments.tsx
with open("src/dentist/pages/appointments.tsx", "r") as f:
    content = f.read()
content = content.replace("const [filterMode, setFilterMode] = useState", "const [filterMode] = useState")
content = content.replace("const [selectedDateChip, setSelectedDateChip] = useState", "const [selectedDateChip] = useState")
content = content.replace("as any", "as unknown")
with open("src/dentist/pages/appointments.tsx", "w") as f:
    f.write(content)

# 5. dashboard.tsx
with open("src/dentist/pages/dashboard.tsx", "r") as f:
    content = f.read()
content = content.replace("val: any", "val: number")
content = content.replace("statuses]: [string, any]", "statuses]: [string, Record<string, number>]")
content = content.replace("s: any /*", "s: { serviceName: string; count: number } /*")
with open("src/dentist/pages/dashboard.tsx", "w") as f:
    f.write(content)

# 6. service-configuration.tsx
with open("src/dentist/pages/service-configuration.tsx", "r") as f:
    content = f.read()
content = content.replace("as any[];", "as unknown[];")
with open("src/dentist/pages/service-configuration.tsx", "w") as f:
    f.write(content)

print("Final Fixes Applied")
