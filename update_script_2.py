import re

with open("src/dentist/pages/service-configuration.tsx", "r") as f:
    content = f.read()

# Add useQueryClient import
content = re.sub(
    r'import { useEffect, useRef, useState, type ChangeEvent } from "react";',
    r'import { useEffect, useRef, useState, type ChangeEvent } from "react";\nimport { useQueryClient } from "@tanstack/react-query";',
    content
)

# Instantiate queryClient inside the component
content = re.sub(
    r'export default function ServiceConfiguration\(\) {',
    r'export default function ServiceConfiguration() {\n const queryClient = useQueryClient();',
    content
)

# Call queryClient.invalidateQueries at the end of the try block in handleSaveIdentity
content = re.sub(
    r'setIdentity\(\(prev\) => \(\{ \.\.\.prev, availableHours: summary \}\)\);',
    r'setIdentity((prev) => ({ ...prev, availableHours: summary }));\n queryClient.invalidateQueries({ queryKey: ["operation-hours"] });\n queryClient.invalidateQueries({ queryKey: ["dentist-profile-full"] });',
    content
)

with open("src/dentist/pages/service-configuration.tsx", "w") as f:
    f.write(content)

