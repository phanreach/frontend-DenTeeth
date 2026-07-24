import re

with open("src/dentist/pages/service-configuration.tsx", "r") as f:
    content = f.read()

# Replace the Handle deleted slots block to also include slots from disabled days
new_deleted_logic = """ // Handle deleted slots
 const allDeletedIds = [...deletedSlotIds];
 availableDays.filter(d => !d.enabled).forEach(d => {
 d.slots.forEach(slot => {
 if (slot.id) allDeletedIds.push(slot.id);
 });
 });

 if (allDeletedIds.length > 0) {
 await Promise.all(allDeletedIds.map(id => deleteOperationHourApi(id)));
 setDeletedSlotIds([]);
 }"""

content = re.sub(
    r'// Handle deleted slots\n\s*if \(deletedSlotIds\.length > 0\) \{\n\s*await Promise\.all\(deletedSlotIds\.map\(id => deleteOperationHourApi\(id\)\)\);\n\s*setDeletedSlotIds\(\[\]\);\n\s*\}',
    new_deleted_logic,
    content
)

with open("src/dentist/pages/service-configuration.tsx", "w") as f:
    f.write(content)
