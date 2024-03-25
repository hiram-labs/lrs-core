import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const TEST_ORG_ID = new ObjectId();
export const TEST_USER_ID = new ObjectId();
export const TEST_OWNER_ID = new ObjectId();
export const TEST_DASH_ID = new ObjectId();
export const TEST_CLIENT_ID = new ObjectId();
export const TEST_ORG_FILTER = { organisation: TEST_ORG_ID };
export const TEST_OWNER_FILTER = { owner: TEST_USER_ID };
export const TEST_PRIVATE_FILTER = {
  $and: [TEST_OWNER_FILTER, TEST_ORG_FILTER]
};
export const TEST_PUBLIC_FILTER = {
  $or: [{ $and: [{ isPublic: true }, TEST_ORG_FILTER] }, TEST_PRIVATE_FILTER]
};
export const TEST_DASH_FILTER = {
  _id: { $in: [] }
};

export const TEST_DASH_DASHBOARD_FILTER = {
  _id: TEST_DASH_ID
};
