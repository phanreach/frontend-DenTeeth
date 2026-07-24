import re

with open("src/dentist/pages/service-configuration.tsx", "r") as f:
    content = f.read()

# Let's find exactly where to inject the button.
# Inside the `item.day` mapping, after the `</div>` that closes the Right side: Time Inputs.
# That div ends after `{isEnabled && editingDays[item.day] && ( ... )}`
# Let's find the string:
target = """  </button>
  )}
  </div>
 </div>
 );"""

replacement = """  </button>
  )}
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
 </div>
 );"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/dentist/pages/service-configuration.tsx", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find target")

