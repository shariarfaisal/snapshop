import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string | number
  label: string
  [key: string]: any
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | number
  onValueChange?: (value: string | number) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  isLoading?: boolean
}

export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      emptyMessage = "No option found.",
      isLoading = false,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")

    const selectedOption = options.find((opt) => opt.value === value)
    const filteredOptions = React.useMemo(() => {
      if (!searchValue) return options
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    }, [options, searchValue])

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="text-sm text-gray-500">Loading...</div>
                </div>
              ) : filteredOptions.length === 0 ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value.toString()}
                      onSelect={(currentValue) => {
                        onValueChange?.(
                          currentValue === value ? "" : option.value
                        )
                        setOpen(false)
                        setSearchValue("")
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

Combobox.displayName = "Combobox"
