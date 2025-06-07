export const useControlledCheckboxGroup = <TEntry extends string>({
  checkedItems,
  onCheckedItemsChange,
  entries,
}: {
  checkedItems: readonly TEntry[];
  entries: readonly TEntry[];
  onCheckedItemsChange: (checkedItems: readonly TEntry[]) => void;
}) => {
  const getCheckboxProps = (value: TEntry) => {
    const checked = checkedItems.includes(value);

    const onChange = (checked: boolean) => {
      if (checked) {
        onCheckedItemsChange([...checkedItems, value]);
      } else {
        onCheckedItemsChange([
          ...checkedItems.filter((item) => item !== value),
        ]);
      }
    };

    return { checked, onChange };
  };

  const checkAll = () => {
    onCheckedItemsChange(entries);
  };

  const uncheckAll = () => {
    onCheckedItemsChange([]);
  };

  const toggleAll = () => {
    if (checkedItems.length === entries.length) {
      uncheckAll();
    } else {
      checkAll();
    }
  };

  const isAllChecked = checkedItems.length === entries.length;

  return {
    checkedItems,
    isAllChecked,
    toggleAll,
    getCheckboxProps,
    checkAll,
    uncheckAll,
  };
};
