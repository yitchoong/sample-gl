/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const RECENT_VOUCHERS = 'gl/home/recent_vouchers';
export const COMMON_VOUCHERS = 'gl/home/common_vouchers';
export const RECURRING_VOUCHERS = 'gl/home/recurring_vouchers';

export const RECENT_VOUCHERS_OK = 'gl/home/recent_vouchers_ok';
export const COMMON_VOUCHERS_OK = 'gl/home/common_vouchers_ok';
export const RECURRING_VOUCHERS_OK = 'gl/home/recurring_vouchers_ok';

export const RECENT_VOUCHERS_KO = 'gl/home/recent_vouchers_ko';
export const COMMON_VOUCHERS_KO = 'gl/home/common_vouchers_ko';
export const RECURRING_VOUCHERS_KO = 'gl/home/recurring_vouchers_ko';

export const HOME_PAGE_DATA = 'gl/home/home_page_data';
export const HOME_DATA_KO = 'gl/home/home_data_ko';
