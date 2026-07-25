import re

with open("src/dentist/pages/service-configuration.tsx", "r") as f:
    content = f.read()

new_days_map = """ const daysMap: Record<string, string> = {
 "1": "Mon", "MONDAY": "Mon", "MON": "Mon",
 "2": "Tue", "TUESDAY": "Tue", "TUE": "Tue",
 "3": "Wed", "WEDNESDAY": "Wed", "WED": "Wed",
 "4": "Thu", "THURSDAY": "Thu", "THU": "Thu",
 "5": "Fri", "FRIDAY": "Fri", "FRI": "Fri",
 "6": "Sat", "SATURDAY": "Sat", "SAT": "Sat",
 "7": "Sun", "SUNDAY": "Sun", "SUN": "Sun",
 };"""

content = re.sub(
    r'const daysMap: Record<string, string> = \{.*?\};',
    new_days_map,
    content,
    flags=re.DOTALL
)

with open("src/dentist/pages/service-configuration.tsx", "w") as f:
    f.write(content)

