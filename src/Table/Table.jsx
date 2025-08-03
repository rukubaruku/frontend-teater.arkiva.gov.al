import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import "./table.css";

const Table = ({ columns, data, onRowClick }) => {
  const transformedColumns = useMemo(() => {
    return columns.map((col) => {
      if (col.Cell) {
        return {
          header: col.header,
          Cell: col.Cell,
          size: col.size || 150,
        };
      }

      if (col.field?.includes(".")) {
        return {
          accessorFn: (row) =>
            col.field.split(".").reduce((obj, key) => obj?.[key], row),
          id: col.field,
          header: col.header,
          size: col.size || 150,
          enableColumnFilterModes: true,
        };
      }

      return {
        accessorKey: col.field,
        header: col.header,
        size: col.size || 150,
        enableColumnFilterModes: true,
      };
    });
  }, [columns]);

  const table = useMaterialReactTable({
    columns: transformedColumns,
    data: data || [],
    enableColumnFilterModes: true,

    initialState: {
      showColumnFilters: true,
    },
    enableGlobalFilter: true,
    enableColumnActions: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    // enableColumnResizing: true,
    // columnResizeMode: "onChange",

    // English localization
    localization: {
      actions: "Actions",
      and: "and",
      cancel: "Cancel",
      changeFilterMode: "Change filter mode",
      changeSearchMode: "Change search mode",
      clearFilter: "Clear filter",
      clearSearch: "Clear search",
      clearSort: "Clear sorting",
      clickToCopy: "Click to copy",
      collapse: "Collapse",
      collapseAll: "Collapse all",
      columnActions: "Column actions",
      copiedToClipboard: "Copied to clipboard",
      dropToGroupBy: "Drop to group by {column}",
      edit: "Edit",
      expand: "Expand",
      expandAll: "Expand all",
      filterByColumn: "Filter by {column}",
      filterMode: "Filter mode",
      groupedBy: "Grouped by ",
      hideAll: "Hide all",
      hideColumn: "Hide column {column}",
      rowActions: "Row actions",
      save: "Save",
      search: "Search",
      selectedCountOfRowCountRowsSelected:
        "{selectedCount} of {rowCount} row(s) selected",
      showAll: "Show all",
      showHideColumns: "Show/Hide columns",
      showHideFilters: "Show/Hide filters",
      showHideSearch: "Show/Hide search",
      sortByColumn: "Sort by {column}",
      thenBy: "then by",
      toggleDensity: "Toggle density",
      toggleFullScreen: "Toggle full screen",
      ungroupByColumn: "Ungroup by {column}",
      // Filter mode translations
      fuzzy: "Fuzzy",
      contains: "Contains",
      startsWith: "Starts with",
      endsWith: "Ends with",
      equals: "Equals",
      notEquals: "Not equals",
      between: "Between",
      betweenInclusive: "Between (inclusive)",
      empty: "Empty",
      notEmpty: "Not empty",
      isNull: "Is null",
      isNotNull: "Is not null",
      greaterThan: "Greater than",
      greaterThanOrEqualTo: "Greater or equal",
      lessThan: "Less than",
      lessThanOrEqualTo: "Less or equal",
      "aria-label": {
        actions: "Actions",
        clearFilter: "Clear filter",
        clearSearch: "Clear search",
        clearSort: "Clear sorting",
        columnActions: "Column actions",
        dropToGroupBy: "Drop to group by {column}",
        edit: "Edit",
        expand: "Expand",
        filterByColumn: "Filter by {column}",
        hideColumn: "Hide column {column}",
        rowActions: "Row actions",
        save: "Save",
        search: "Search",
        showHideColumns: "Show/Hide columns",
        showHideFilters: "Show/Hide filters",
        showHideSearch: "Show/Hide search",
        sortByColumn: "Sort by {column}",
        toggleDensity: "Toggle density",
        toggleFullScreen: "Toggle full screen",
        ungroupByColumn: "Ungroup by {column}",
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
        overflow: "hidden",
        border: "none",
        boxShadow: "none",
        background: "transparent",
      },
    },

    muiTableContainerProps: {
      sx: {
        borderRadius: "0",
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#c1c1c1",
          borderRadius: "4px",
          "&:hover": {
            background: "#a8a8a8",
          },
        },
      },
    },

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#F4F6F8",
        color: "#2b3240",
        fontSize: "16px",
        fontWeight: "700",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        borderBottom: "2px solid #E0E3E7",
        padding: "18px 14px",
        textShadow: "0 1px 2px rgba(0,0,0,0.04)",
        boxShadow: "0 1px 4px rgba(60,72,88,0.04)",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        "& .MuiInputBase-root": {
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "8px",
          color: "#2b3240",
          "& input": {
            color: "#2b3240",
            "::placeholder": {
              color: "rgba(107,114,128,0.8)",
            },
          },
        },
        "& .MuiFormHelperText-root": {
          color: "rgba(55,65,81,0.9)",
          fontWeight: "500",
        },
        "& svg": {
          color: "#2b3240 !important",
        },
        "& span > span > svg": {
          color: "#2b3240 !important",
        },
        "& .MuiIconButton-root": {
          color: "#2b3240 !important",
          "&:hover": {
            backgroundColor: "rgba(55,65,81,0.08)",
          },
        },
        "& .MuiTableSortLabel-icon": {
          color: "#2b3240 !important",
        },
        "& span > svg": {
          color: "#2b3240 !important",
        },
        "& .MuiInputAdornment-root svg": {
          color: "#2b3240 !important",
        },
      },
    },

    muiTableBodyCellProps: {
      sx: {
        fontSize: "14px",
        color: "#2b3240",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontWeight: "500",
        borderBottom: "1px solid #f0f0f0",
        padding: "16px 12px",
      },
    },

    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => onRowClick?.(row.original),
      sx: {
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          backgroundColor: "rgba(189, 30, 44, 0.04) !important",
          transform: "translateY(-1px)",
          boxShadow: "0 2px 8px rgba(189, 30, 44, 0.1)",
        },
        "&.Mui-selected": {
          backgroundColor: "rgba(189, 30, 44, 0.08) !important",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "rgba(189, 30, 44, 0.12) !important",
        },
      },
    }),

    muiToolbarAlertBannerProps: {
      sx: {
        backgroundColor: "rgba(189, 30, 44, 0.1)",
        color: "#BD1E2C",
        borderRadius: "8px",
        border: "1px solid rgba(189, 30, 44, 0.2)",
      },
    },

    muiSearchTextFieldProps: {
      sx: {
        "& .MuiInputBase-root": {
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e1e5e9",
          color: "#2b3240",
          "& input": {
            color: "#2b3240",
            "&::placeholder": {
              color: "#6b7280",
            },
          },
          "&:hover": {
            borderColor: "#BD1E2C",
          },
          "&.Mui-focused": {
            borderColor: "#BD1E2C",
            boxShadow: "0 0 0 3px rgba(189, 30, 44, 0.1)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#BD1E2C !important",
          },
          "&.Mui-focused .MuiInputBase-input": {
            color: "#2b3240",
          },
        },
      },
    },

    muiFilterTextFieldProps: {
      sx: {
        "& .MuiInputBase-root": {
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          border: "1px solid #e1e5e9",
          fontSize: "13px",
          color: "#2b3240",
          "& input": {
            color: "#2b3240",
            "&::placeholder": {
              color: "#6b7280",
            },
          },
          "&:hover": {
            borderColor: "#BD1E2C",
          },
          "&.Mui-focused": {
            borderColor: "#BD1E2C",
            boxShadow: "0 0 0 2px rgba(189, 30, 44, 0.1)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#BD1E2C !important",
          },
          "&.Mui-focused .MuiInputBase-input": {
            color: "#2b3240",
          },
        },
      },
    },

    muiTablePaginationProps: {
      sx: {
        "& .MuiTablePagination-selectLabel": {
          color: "#6b7280",
          fontWeight: "500",
        },
        "& .MuiTablePagination-displayedRows": {
          color: "#2b3240",
          fontWeight: "500",
        },
        "& .MuiIconButton-root": {
          color: "#6b7280",
          "&:hover": {
            backgroundColor: "rgba(189, 30, 44, 0.1)",
            color: "#BD1E2C",
          },
          "&.Mui-disabled": {
            color: "#d1d5db",
          },
        },
      },
    },

    muiTableHeadCellFilterModeMenuButtonProps: ({ column, table }) => {
      const filter = table
        .getState()
        .columnFilters.find((f) => f.id === column.id);
      const filterFn = filter?.filterFn || filter?.operator;
      const isActive = filterFn && filterFn !== "equals";
      return {
        sx: {
          backgroundColor: isActive ? "#F87171" : "transparent",
          color: isActive ? "#fff" : "#2b3240",
          borderRadius: "6px",
          transition: "background 0.2s",
          boxShadow: isActive ? "0 1px 4px rgba(248,113,113,0.15)" : "none",
          "&:hover": {
            backgroundColor: isActive ? "#F43F5E" : "#f0f0f0",
          },
        },
      };
    },
  });

  return (
    <div className="table-container">
      <MaterialReactTable table={table} />
    </div>
  );
};

export default Table;
