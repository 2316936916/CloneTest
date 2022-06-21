export const PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 99999999;
export const CENTER = [121.5459848776148, 29.761972080738552];

export const TOASTR_TYPE_INFO = 1;
export const TOASTR_TYPE_SUCCESS = 2;
export const TOASTR_TYPE_WARN = 3;
export const TOASTR_TYPE_ERROR = 4;

export const FIELD_PROP_TYPE_ITEM = 3;

export const toastrTypeNameMap = {
  [TOASTR_TYPE_INFO]: 'info',
  [TOASTR_TYPE_SUCCESS]: 'success',
  [TOASTR_TYPE_WARN]: 'warn',
  [TOASTR_TYPE_ERROR]: 'error',
};

export const toastrTypeColorMap = {
  [TOASTR_TYPE_INFO]: 'rgba(51,51,51,1)',
  [TOASTR_TYPE_SUCCESS]: 'rgba(60,179,113, 1)',
  [TOASTR_TYPE_WARN]: 'rgba(240,155,85,1)',
  [TOASTR_TYPE_ERROR]: 'rgba(244,126,122,1)',
};
