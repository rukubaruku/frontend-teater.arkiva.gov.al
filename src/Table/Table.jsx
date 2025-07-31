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
    initialState: { showColumnFilters: true },
    enableGlobalFilter: true,
    enableColumnActions: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,

    // Italian localization
    localization: {
      actions: "Azioni",
      and: "e",
      cancel: "Annulla",
      changeFilterMode: "Cambia modalità filtro",
      changeSearchMode: "Cambia modalità ricerca",
      clearFilter: "Cancella filtro",
      clearSearch: "Cancella ricerca",
      clearSort: "Cancella ordinamento",
      clickToCopy: "Clicca per copiare",
      collapse: "Comprimi",
      collapseAll: "Comprimi tutto",
      columnActions: "Azioni colonna",
      copiedToClipboard: "Copiato negli appunti",
      dropToGroupBy: "Rilascia per raggruppare per {column}",
      edit: "Modifica",
      expand: "Espandi",
      expandAll: "Espandi tutto",
      filterByColumn: "Filtra per {column}",
      filterMode: "Modalità filtro",
      groupedBy: "Raggruppato per ",
      hideAll: "Nascondi tutto",
      hideColumn: "Nascondi colonna {column}",
      rowActions: "Azioni riga",
      save: "Salva",
      search: "Cerca",
      selectedCountOfRowCountRowsSelected:
        "{selectedCount} di {rowCount} riga(e) selezionata(e)",
      showAll: "Mostra tutto",
      showHideColumns: "Mostra/Nascondi colonne",
      showHideFilters: "Mostra/Nascondi filtri",
      showHideSearch: "Mostra/Nascondi ricerca",
      sortByColumn: "Ordina per {column}",
      thenBy: "poi per",
      toggleDensity: "Cambia densità",
      toggleFullScreen: "Schermo intero",
      ungroupByColumn: "Rimuovi raggruppamento per {column}",
      // Filter mode translations
      fuzzy: "Approssimativo",
      contains: "Contiene",
      startsWith: "Inizia con",
      endsWith: "Finisce con",
      equals: "Uguale a",
      notEquals: "Diverso da",
      between: "Tra",
      betweenInclusive: "Tra (inclusivo)",
      empty: "Vuoto",
      notEmpty: "Non vuoto",
      isNull: "È nullo",
      isNotNull: "Non è nullo",
      greaterThan: "Maggiore di",
      greaterThanOrEqualTo: "Maggiore o uguale a",
      lessThan: "Minore di",
      lessThanOrEqualTo: "Minore o uguale a",
      "aria-label": {
        actions: "Azioni",
        clearFilter: "Cancella filtro",
        clearSearch: "Cancella ricerca",
        clearSort: "Cancella ordinamento",
        columnActions: "Azioni colonna",
        dropToGroupBy: "Rilascia per raggruppare per {column}",
        edit: "Modifica",
        expand: "Espandi",
        filterByColumn: "Filtra per {column}",
        hideColumn: "Nascondi colonna {column}",
        rowActions: "Azioni riga",
        save: "Salva",
        search: "Cerca",
        showHideColumns: "Mostra/Nascondi colonne",
        showHideFilters: "Mostra/Nascondi filtri",
        showHideSearch: "Mostra/Nascondi ricerca",
        sortByColumn: "Ordina per {column}",
        toggleDensity: "Cambia densità",
        toggleFullScreen: "Schermo intero",
        ungroupByColumn: "Rimuovi raggruppamento per {column}",
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
        backgroundColor: "#BD1E2C",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        borderBottom: "1px solid #a0182a",
        "& .MuiInputBase-root": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          color: "#ffffff",
          "& input": {
            color: "#ffffff",
            "&::placeholder": {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        "& .MuiFormHelperText-root": {
          color: "rgba(255, 255, 255, 0.8)",
          fontWeight: "500",
        },
        "& svg": {
          color: "#ffffff !important",
        },
        "& span > span > svg": {
          color: "#ffffff !important",
        },
        "& .MuiIconButton-root": {
          color: "#ffffff !important",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
        "& .MuiTableSortLabel-icon": {
          color: "#ffffff !important",
        },
        "& span > svg": {
          color: "#ffffff !important",
        },
        "& .MuiInputAdornment-root svg": {
          color: "#ffffff !important",
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
        "& .MuiInputBase-root .Mui-focused": {
          borderColor: "#BD1E2C",
        },
        "& .MuiInputBase-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#BD1E2C",
        },
        "& .MuiInputBase-root .Mui-focused .MuiOutlinedInput-notchedOutline:hover":
          {
            borderColor: "#BD1E2C",
          },
        "& .MuiInputBase-root:focus-within": {
          borderColor: "#BD1E2C",
        },
        "& .MuiInputBase-root:focus-within .MuiOutlinedInput-notchedOutline": {
          borderColor: "#BD1E2C",
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
        "& .MuiInputBase-root .Mui-focused": {
          borderColor: "#BD1E2C",
        },
        "& .MuiInputBase-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#BD1E2C",
        },
        "& .MuiInputBase-root .Mui-focused .MuiOutlinedInput-notchedOutline:hover":
          {
            borderColor: "#BD1E2C",
          },
        "& .MuiInputBase-root:focus-within": {
          borderColor: "#BD1E2C",
        },
        "& .MuiInputBase-root:focus-within .MuiOutlinedInput-notchedOutline": {
          borderColor: "#BD1E2C",
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
  });

  return (
    <div className="table-container">
      <MaterialReactTable table={table} />
    </div>
  );
};

export default Table;
