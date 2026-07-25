import re

# 1. api.ts
with open("src/api/api.ts", "r") as f:
    content = f.read()
content = content.replace("error: any", "error: unknown")
with open("src/api/api.ts", "w") as f:
    f.write(content)

# 2. change-password-modal.tsx
with open("src/components/dentist/change-password-modal.tsx", "r") as f:
    content = f.read()
# It seems `_data` wasn't replaced
content = content.replace("onSubmit={(_data) => {", "onSubmit={() => {")
content = content.replace("(_data) =>", "() =>")
with open("src/components/dentist/change-password-modal.tsx", "w") as f:
    f.write(content)

# 3. service-modal.tsx
with open("src/components/dentist/service-modal.tsx", "r") as f:
    content = f.read()
content = content.replace(": any", ": unknown")
with open("src/components/dentist/service-modal.tsx", "w") as f:
    f.write(content)

# 4. appointments.tsx
with open("src/dentist/pages/appointments.tsx", "r") as f:
    content = f.read()
content = re.sub(r'const \[filterMode,\s*setFilterMode\] = useState<"all" \| "today">\("today"\);', r'const [filterMode] = useState<"all" | "today">("today");', content)
content = re.sub(r'const \[selectedDateChip,\s*setSelectedDateChip\] = useState<string \| null>\(null\);', r'const [selectedDateChip] = useState<string | null>(null);', content)
content = content.replace(": any", ": unknown")
with open("src/dentist/pages/appointments.tsx", "w") as f:
    f.write(content)

# 5. dashboard.tsx
with open("src/dentist/pages/dashboard.tsx", "r") as f:
    content = f.read()
content = content.replace(": any", ": unknown")
with open("src/dentist/pages/dashboard.tsx", "w") as f:
    f.write(content)

# 6. service-configuration.tsx
with open("src/dentist/pages/service-configuration.tsx", "r") as f:
    content = f.read()
content = content.replace("(s: any /* eslint-disable-line @typescript-eslint/no-explicit-any */)", "(s: unknown)")
content = content.replace(": any", ": unknown")
with open("src/dentist/pages/service-configuration.tsx", "w") as f:
    f.write(content)

print("Fixed")
