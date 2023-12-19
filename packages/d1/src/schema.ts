import { Static, Type } from '@sinclair/typebox'

const T = {
  // 販売会社マスタ (distributor_master)
  distributorBranchId: Type.String({ minLength: 1, maxLength: 20 }),
  distributorId: Type.String({ minLength: 1, maxLength: 3 }),
  branchId: Type.String({ minLength: 1, maxLength: 3 }),
  distributorName: Type.String({ minLength: 1, maxLength: 16 }),
  branchName: Type.String({ minLength: 1, maxLength: 16 }),

  // ロールマスタ (role_master)
  roleId: Type.Number(),
  categoryId: Type.Number(),
  roleType: Type.Number(),
  selectFlag: Type.Boolean(),
  roleName: Type.String({ minLength: 1, maxLength: 40 }),

  // 機種マスタ (model_master)
  model: Type.Number(),
  deviceName: Type.String({ minLength: 1, maxLength: 26 }),
  modelType: Type.String({ minLength: 1, maxLength: 26 }),
  modelId: Type.String({ minLength: 1, maxLength: 3 }),

  // エラーマスタ (error_master)
  errorCode: Type.String({ minLength: 1, maxLength: 6 }),
  errorGroupId: Type.Number(),
  errorGroup: Type.String({ minLength: 1, maxLength: 16 }),
  errorName: Type.String({ minLength: 1, maxLength: 50 }),

  // ユーザーマスタ (user_master)
  userId: Type.String({ minLength: 1, maxLength: 20 }),
  userName: Type.String({ minLength: 1, maxLength: 60 }),
  passwordHash: Type.String({ minLength: 1, maxLength: 255 }),
  emailAddress: Type.String({ minLength: 1, maxLength: 254 }),
  affiliation: Type.String({ minLength: 1, maxLength: 60 }),
  // distributorBranchId: Type.Optional(Type.String({ minLength: 1, maxLength: 20 })),
  passInitKey: Type.Optional(Type.String({ minLength: 1, maxLength: 64 })),
  passInitKeyLimit: Type.Optional(Type.String()), // timestamp with time zone

  // 顧客マスタ (customer_master)
  customerUserId: Type.String({ minLength: 1, maxLength: 20 }),
  salesUserId: Type.String({ minLength: 1, maxLength: 20 }),

  // 装置マスタ (machine_master)
  serialNumber: Type.String({ minLength: 1, maxLength: 9 }),
  // customerUserId: Type.String({ minLength: 1, maxLength: 20 }),
  destination: Type.String({ minLength: 1, maxLength: 150 }),
  // distributorBranchId: Type.String({ minLength: 1, maxLength: 20 }),
  serviceUserId: Type.String({ minLength: 1, maxLength: 20 }),
  startDate: Type.String(), // date
}

const userMasterTable = Type.Object({
  userId: T.userId,
  userName: T.userName,
  passwordHash: T.passwordHash,
  emailAddress: T.emailAddress,
  affiliation: T.affiliation,
  distributorBranchId: T.distributorBranchId,
  passInitKey: T.passInitKey,
  passInitKeyLimit: T.passInitKeyLimit,
})

type UserMasterTable = Static<typeof userMasterTable>

const distributorMasterTable = Type.Object({
  distributorBranchId: T.distributorBranchId,
  distributorId: T.distributorId,
  branchId: T.branchId,
  distributorName: T.distributorName,
  branchName: T.branchName,
})

const roleMasterTable = Type.Object({
  roleId: T.roleId,
  categoryId: T.categoryId,
  roleType: T.roleType,
  selectFlag: T.selectFlag,
  roleName: T.roleName,
})

const modelMasterTable = Type.Object({
  model: T.model,
  deviceName: T.deviceName,
  modelType: T.modelType,
  modelId: T.modelId,
})

const errorMasterTable = Type.Object({
  modelId: T.modelId,
  errorCode: T.errorCode,
  errorGroupId: T.errorGroupId,
  errorGroup: T.errorGroup,
  errorName: T.errorName,
})

const customerMasterTable = Type.Object({
  customerUserId: T.customerUserId,
  salesUserId: T.salesUserId,
})

const machineMasterTable = Type.Object({
  serialNumber: T.serialNumber,
  customerUserId: T.customerUserId,
  destination: T.destination,
  distributorBranchId: T.distributorBranchId,
  serviceUserId: T.serviceUserId,
  startDate: T.startDate,
})

export {
  T,
  userMasterTable,
  UserMasterTable,
  distributorMasterTable,
  roleMasterTable,
  modelMasterTable,
  errorMasterTable,
  customerMasterTable,
  machineMasterTable,
}
