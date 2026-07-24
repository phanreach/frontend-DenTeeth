import re

with open("src/dentist/pages/service-configuration.tsx", "r") as f:
    content = f.read()

# 1. Replace deletedSlotIds with editingDays
content = re.sub(
    r'const \[deletedSlotIds, setDeletedSlotIds\] = useState<number\[\]>\(\[\]\);',
    r'const [editingDays, setEditingDays] = useState<Record<string, boolean>>({});',
    content
)

# 2. Add handleSaveDay and update handleSaveIdentity
handle_save_identity_new = """
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
 const summary = formatOperationHoursSummary(availableDays);
 setIdentity((prev) => ({ ...prev, availableHours: summary }));
 queryClient.invalidateQueries({ queryKey: ["dentist-profile-full"] });
 } catch (err) {
 console.error("Profile update failed:", err);
 return;
 }
 }
 setIsEditingIdentity((prev) => !prev);
 };

 const handleSaveDay = async (day: string) => {
 setIsSyncing(true);
 try {
 const dayToNum: Record<string, number> = {
 "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 7,
 };
 const daysMap: Record<string, string> = {
 "1": "Mon", "MONDAY": "Mon",
 "2": "Tue", "TUESDAY": "Tue",
 "3": "Wed", "WEDNESDAY": "Wed",
 "4": "Thu", "THURSDAY": "Thu",
 "5": "Fri", "FRIDAY": "Fri",
 "6": "Sat", "SATURDAY": "Sat",
 "7": "Sun", "SUNDAY": "Sun",
 };
 const dayNum = dayToNum[day];
 const dayData = availableDays.find(d => d.day === day);
 if (!dayData) return;
 
 const hoursSource = (apiOperationHours && Array.isArray(apiOperationHours) && apiOperationHours.length > 0)
 ? apiOperationHours
 : (profile?.operationHours && Array.isArray(profile.operationHours))
 ? profile.operationHours
 : [];

 const originalSlotsForDay = hoursSource.filter((s: any) => 
 daysMap[String(s.dayOfWeek).toUpperCase()] === day
 ) || [];
 
 const originalSlotIds = originalSlotsForDay.map((s: any) => s.id).filter((id: any) => id);
 
 const currentSlots = dayData.enabled ? dayData.slots.filter(s => s.startAt && s.endAt) : [];
 const currentSlotIds = currentSlots.map(s => s.id).filter(id => id);
 
 const idsToDelete = originalSlotIds.filter((id: any) => !currentSlotIds.includes(id));
 if (idsToDelete.length > 0) {
 await Promise.all(idsToDelete.map((id: any) => deleteOperationHourApi(id)));
 }
 
 const slotsToUpdate: any[] = [];
 const slotsToCreate: any[] = [];
 
 for (const slot of currentSlots) {
 const payload = { dayOfWeek: dayNum, startAt: slot.startAt, endAt: slot.endAt };
 if (slot.id) {
 slotsToUpdate.push({ id: slot.id, data: payload });
 } else {
 slotsToCreate.push(payload);
 }
 }
 
 if (slotsToUpdate.length > 0) {
 await Promise.all(slotsToUpdate.map(update => updateOperationHourApi(update.id, update.data)));
 }
 
 if (slotsToCreate.length > 0) {
 const uniqueNewSlots = slotsToCreate.filter((slot, index, self) => 
 index === self.findIndex(s => s.startAt === slot.startAt && s.endAt === slot.endAt)
 );
 await createOperationHoursMutation.mutateAsync({ hours: uniqueNewSlots });
 }
 
 toast.success(`Operation hours for ${day} saved`);
 queryClient.invalidateQueries({ queryKey: ["operation-hours"] });
 queryClient.invalidateQueries({ queryKey: ["dentist-profile-full"] });
 setEditingDays(prev => ({ ...prev, [day]: false }));
 
 const summary = formatOperationHoursSummary(availableDays);
 setIdentity((prev) => ({ ...prev, availableHours: summary }));
 } catch (err) {
 console.error(`Failed to save ${day}`, err);
 toast.error(`Failed to save operation hours for ${day}`);
 } finally {
 setIsSyncing(false);
 }
 };
"""

# We need to replace the old handleSaveIdentity completely
content = re.sub(
    r'const handleSaveIdentity = async \(\) => \{.*?(?=const isBusy = )',
    handle_save_identity_new.strip() + '\n\n ',
    content,
    flags=re.DOTALL
)

# 3. Fix the Operations section UI
# Remove the global edit button
content = re.sub(
    r'<button\s*onClick=\{handleSaveIdentity\}\s*className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-100 px-4 text-\[10px\] font-semibold text-indigo-600 transition active:scale-95"\s*>\s*\{isEditingIdentity \? <Save className="size-3\.5" /> : <Pencil className="size-3\.5" />\}\s*\{isEditingIdentity \? "Save" : "Edit"\}\s*</button>',
    '',
    content
)

# 4. Replace isEditingIdentity with editingDays[item.day] in the Operation Section
# We need to do this carefully inside the activeTab === "operation" section.
# First, extract the Operation section
operation_section_match = re.search(r'\{\/\* Operation Section \*\/.*?\}\s*\{\/\* Services Section \*\/\}', content, re.DOTALL)
if operation_section_match:
    operation_section = operation_section_match.group(0)
    
    # Replace disabled={!isEditingIdentity}
    operation_section = operation_section.replace('disabled={!isEditingIdentity}', 'disabled={!editingDays[item.day]}')
    
    # Replace if (isEditingIdentity)
    operation_section = operation_section.replace('if (isEditingIdentity)', 'if (editingDays[item.day])')
    
    # Replace isEditingIdentity ? with editingDays[item.day] ?
    operation_section = operation_section.replace('isEditingIdentity ?', 'editingDays[item.day] ?')
    
    # Replace isEditingIdentity && with editingDays[item.day] &&
    operation_section = operation_section.replace('isEditingIdentity &&', 'editingDays[item.day] &&')
    
    # Remove the deletedSlotIds logic from the trash button onClick
    trash_logic_old = """const deletedSlot = d.slots[slotIndex];
   if (deletedSlot.id) {
     setDeletedSlotIds(prev => [...prev, deletedSlot.id as number]);
   }
   const newSlots = d.slots.filter((_, i) => i !== slotIndex);"""
    trash_logic_new = """const newSlots = d.slots.filter((_, i) => i !== slotIndex);"""
    operation_section = operation_section.replace(trash_logic_old, trash_logic_new)
    
    # Add the individual Save button next to the time inputs
    # Let's find the closing div of the item flex container and insert the button before it
    # But wait, it's easier to find the div that contains the Time Inputs and append a sibling div
    time_inputs_end = r'\}\)\)\s*\) : \(\s*<span className="text-xs font-semibold text-muted-foreground pt-2">Closed</span>\s*\)\}\s*\{editingDays\[item\.day\] && \(\s*<button.*?</button>\s*\)\}\s*</div>'
    
    button_html = """
  </div>
  <div className="flex items-center sm:ml-4 mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4">
    <button
      onClick={() => editingDays[item.day] ? handleSaveDay(item.day) : setEditingDays(prev => ({...prev, [item.day]: true}))}
      disabled={isSyncing}
      className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-100 px-4 text-[10px] font-semibold text-indigo-600 transition active:scale-95 disabled:opacity-50"
    >
      {editingDays[item.day] ? <Save className="size-3.5" /> : <Pencil className="size-3.5" />}
      {editingDays[item.day] ? "Save" : "Edit"}
    </button>
  </div>
"""
    operation_section = re.sub(time_inputs_end, lambda m: m.group(0).replace('</div>', button_html, 1), operation_section, flags=re.DOTALL)
    
    # Now write it back
    content = content[:operation_section_match.start()] + operation_section + content[operation_section_match.end():]

with open("src/dentist/pages/service-configuration.tsx", "w") as f:
    f.write(content)
