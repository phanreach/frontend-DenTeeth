import re

with open("src/dentist/pages/service-configuration.tsx", "r") as f:
    content = f.read()

# 1. Add imports
content = re.sub(
    r'import useCreateOperationHours from "../hooks/use-create-operation-hours";',
    r'import useCreateOperationHours from "../hooks/use-create-operation-hours";\nimport { deleteOperationHourApi, updateOperationHourApi } from "../../api/api";',
    content
)

# 2. Add deletedSlotIds state
content = re.sub(
    r'const \[isSyncing, setIsSyncing\] = useState\(false\);\n const fileInputRef = useRef<HTMLInputElement \| null>\(null\);',
    r'const [isSyncing, setIsSyncing] = useState(false);\n const fileInputRef = useRef<HTMLInputElement | null>(null);\n const [deletedSlotIds, setDeletedSlotIds] = useState<number[]>([]);',
    content
)

# 3. Add id to validSlots
content = re.sub(
    r'startAt: formatTime\(s.startAt\),\n\s*endAt: formatTime\(s.endAt\),\n\s*}\)\);',
    r'id: s.id,\n      startAt: formatTime(s.startAt),\n      endAt: formatTime(s.endAt),\n    }));',
    content
)

# 4. Handle deleting slots in UI
content = re.sub(
    r'const newSlots = d\.slots\.filter\(\(_, i\) => i !== slotIndex\);\n\s*return { \.\.\.d, slots: newSlots };',
    r'const deletedSlot = d.slots[slotIndex];\n   if (deletedSlot.id) {\n     setDeletedSlotIds(prev => [...prev, deletedSlot.id as number]);\n   }\n   const newSlots = d.slots.filter((_, i) => i !== slotIndex);\n   return { ...d, slots: newSlots };',
    content
)

# 5. Handle save logic (replace handleSaveIdentity)
save_logic = """
 const handleSaveIdentity = async () => {
 if (isEditingIdentity) {
 try {
 // Save profile
 await updateProfileMutation.mutateAsync({
 userId: profile?.userId || profile?.id,
 firstName: identity.firstName || "",
 lastName: identity.lastName || "",
 gender: identity.gender || "MALE",
 phoneNumber: identity.phoneNumber || "",
 clinicName: identity.clinicName || "",
 biography: identity.biography || "",
 licenseNumber: identity.licenseNumber || "",
 yearsOfExperience: identity.yearsOfExperience || 0,
 });

 // Handle deleted slots
 if (deletedSlotIds.length > 0) {
 await Promise.all(deletedSlotIds.map(id => deleteOperationHourApi(id)));
 setDeletedSlotIds([]);
 }

 // Save operation hours
 const dayToNum: Record<string, number> = {
 "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 7,
 };
 
 const newSlotsToCreate: any[] = [];
 const slotsToUpdate: any[] = [];

 availableDays
 .filter(d => d.enabled)
 .forEach(d => {
 d.slots
 .filter(slot => slot.startAt && slot.endAt)
 .forEach(slot => {
 const payload = {
 dayOfWeek: dayToNum[d.day] || 1,
 startAt: slot.startAt,
 endAt: slot.endAt,
 };
 if (slot.id) {
 slotsToUpdate.push({ id: slot.id, data: payload });
 } else {
 newSlotsToCreate.push(payload);
 }
 });
 });

 if (slotsToUpdate.length > 0) {
 await Promise.all(slotsToUpdate.map(update => updateOperationHourApi(update.id, update.data)));
 }

 if (newSlotsToCreate.length > 0) {
 // Deduplicate new slots just in case
 const uniqueNewSlots = newSlotsToCreate.filter((slot, index, self) => 
 index === self.findIndex(s => 
 s.dayOfWeek === slot.dayOfWeek && 
 s.startAt === slot.startAt && 
 s.endAt === slot.endAt
 )
 );
 
 await createOperationHoursMutation.mutateAsync({
 hours: uniqueNewSlots,
 });
 }

 // Update local formatting summary
 const summary = formatOperationHoursSummary(availableDays);
 setIdentity((prev) => ({ ...prev, availableHours: summary }));
 } catch (err) {
 console.error("Profile or hours update failed:", err);
 return;
 }
 }
 setIsEditingIdentity((prev) => !prev);
 };
"""

# I need to find the old handleSaveIdentity and replace it.
import re
content = re.sub(
    r'const handleSaveIdentity = async \(\) => \{.*?(?=const isBusy = )',
    save_logic.strip() + '\n\n ',
    content,
    flags=re.DOTALL
)

with open("src/dentist/pages/service-configuration.tsx", "w") as f:
    f.write(content)

