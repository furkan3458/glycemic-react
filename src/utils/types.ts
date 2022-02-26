enum ActionTypes {
    AUTH_LOADING = "AUTH_LOADING",
    AUTH_AUTHENTICATION = "AUTH_AUTHENTICATION",
    AUTH_VALIDATE = "AUTH_VALIDATE",
    AUTH_RESET = "AUTH_RESET",
    AUTH_VALIDATE_EMAIL = "AUTH_VALIDATE_EMAIL",
    AUTH_FAIL = "AUTH_FAIL",
    AUTH_LOGOUT = "AUTH_LOGOUT",
    AUTH_ACTIVITY = "AUTH_ACTIVITY",
    AUTH_PASSWORD_RESULT = "AUTH_PASSWORD_RESULT",
    AUTH_ACTIVITY_RESET = "AUTH_ACTIVITY_RESET",

    FOOD_LOADING = "FOOD_LOADING",
    FOOD_SET = "FOOD_SET",
    FOOD_SET_PAGEABLE = "FOOD_SET_PAGEABLE",

    LIST_INITIALIZE = "LIST_INITIALIZE",
    LIST_LOADING = "LIST_LOADING",
    LIST_SET = "LIST_SET",
    LIST_ADD = "LIST_ADD",
    LIST_UPDATE = "LIST_UPDATE",
    LIST_REMOVE = "LIST_REMOVE",

    CATEGORY_INITIALIZE = "CATEGORY_INITIALIZE",
    CATEGORY_LOADING = "CATEGORY_LOADING",
    CATEGORY_SET = "CATEGORY_SET",
    CATEGORY_SINGLE = "CATEGORY_SINGLE",
    CATEGORY_SET_PAGEABLE = "CATEGORY_SET_PAGEABLE",

    SEARCH_LOADING = "SEARCH_LOADING",
    SEARCH_RESULTED = "SEARCH_RESULTED",
    SEARCH_SET_TEXT = "SEARCH_SET_TEXT",
    SEARCH_SET_PAGE = "SEARCH_SET_PAGE",
    SEARCH_SET_TOTAL = "SEARCH_SET_TOTAL",
    SEARCH_SET_CATEGORY = "SEARCH_SET_CATEGORY",
    SEARCH_SET_RESULTS = "SEARCH_SET_RESULTS",
    SEARCH_RESULT_CLEAR = "SEARCH_RESULT_CLEAR",
    SEARCH_SET_DB = "SEARCH_SET_DB",

    CITY_LOADING = "CITY_LOADING",
    CITY_SET = "CITY_SET",

    MAIL_LOADING = "MAIL_LOADING",
    MAIL_SET_STATE = "MAIL_SET_STATE",
    MAIL_CLEAR = "MAIL_CLEAR"
};
export default ActionTypes;