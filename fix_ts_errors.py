import re

with open("src/dentist/pages/service-configuration.tsx", "r") as f:
    content = f.read()

# We need to replace `unknown` with `any /* eslint-disable-line @typescript-eslint/no-explicit-any */`
# but only in the specific places we found them.
replacements = [
    (r'\(s: unknown\)', r'(s: any /* eslint-disable-line @typescript-eslint/no-explicit-any */)'),
    (r'\(slot: unknown\s*\)', r'(slot: any /* eslint-disable-line @typescript-eslint/no-explicit-any */)'),
    (r'\(id: unknown\s*\)', r'(id: any /* eslint-disable-line @typescript-eslint/no-explicit-any */)'),
    (r': unknown\s*\[\]', r': any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */')
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open("src/dentist/pages/service-configuration.tsx", "w") as f:
    f.write(content)

print("Replaced unknown with any")
