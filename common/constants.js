const USER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
};
const USER_STATUS_LIST = [
  'pending',
  'active',
];
const CITY_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
};
const CITY_STATUS_LIST = [
  'pending',
  'active',
];
const USER_ROLES = {
  ADMIN: 'admin',
  FRANCHISE_OWNER: 'franchise_owner',
  CUSTOMER: 'customer',
  DRIVER: 'driver',
  FRANCHISE_MANAGER: 'franchise_manager',
  FRANCHISE_STAFF: 'franchise_staff',
};
const USER_ROLES_LIST = [
  'admin',
  'franchise_owner',
  'customer',
  'driver',
  'franchise_manager',
  'franchise_staff'
];
const SALT_ROUNDS = 10;

const ORDER_STATUS = {
  PLACED: 'Placed',
  PICKUP_READY: 'Ready to PickUp',
  PICKED_UP: 'Picked Up',
  CONFIRMED: 'Confirmed',
  IN_PROCESS: 'In Process',
  SHIPPED: 'Shipped',
  IN_TRANSMIT: 'In Transmit',
  DELIVERED: 'Delivered',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled'
};
const ORDER_STATUS_LIST = [
  'Placed',
  'Ready to PickUp',
  'Picked Up',
  'Confirmed',
  'In Process',
  'Shipped',
  'In Transmit',
  'Delivered',
  'Rejected',
  'Cancelled'
];

const PAYMENT_METHOD_LIST = [
  'Cash on delivery',
  'Debit/Credit card',
  'UPI',
  'Netbanking'
];

const SERVICE_TYPE = {
  KG_BASED: 'kg_based',
  PIECE_BASED: 'piece_based'
}


const COUPON_RATE_TYPE = [
   'fixed', 
   'percentage'
]

const WALLET_CONFIG_TYPE = [
  'fixed', 
  'percentage'
]

module.exports = {
  USER_STATUS,
  USER_ROLES,
  SALT_ROUNDS,
  USER_ROLES_LIST,
  USER_STATUS_LIST,
  CITY_STATUS,
  CITY_STATUS_LIST,
  ORDER_STATUS,
  ORDER_STATUS_LIST,
  PAYMENT_METHOD_LIST,
  SERVICE_TYPE,
  COUPON_RATE_TYPE,
  WALLET_CONFIG_TYPE
};