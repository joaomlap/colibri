class AssetType {
  id: string;
  name: string;
  regionTypes: RegionType[];
}

class Asset {
  id: string;
  name: string;
  type: AssetType;
  regions: Region[];
}

class RegionType {
  id: string;
  name: string;
}

class Region {
  id: string;
  name: string;
  type: RegionType;
}

class Subject {
  id: string;
  name: string;
  region: Region; // if needed
}

class ActionType {
  id: string;
  name: string;
  assetTypes: AssetType[];
  regionTypes: RegionType[];
  approvalFrom: User[] | UserGroup[] | Permission[];
  confirmationFrom: User[] | UserGroup[] | Permission[];
}

class Action {
  id: string;
  name: string;
  type: ActionType;
  assets: Asset[];
  regions: Region[];
  modules: Module[];
  approvalFrom: User[] | UserGroup[] | Permission[];
  confirmationFrom: User[] | UserGroup[] | Permission[];
}

class Module {
  id: string;
  name: string;
  // data
}

class WorkerGroup {
  id: string;
  name: string;
  permission: Permission[];
  capabilities: Capability[];
}

class Worker {
  id: string;
  name: string;
  group: WorkerGroup;
  permission: Permission[];
  capabilities: Capability[];
}

class UserGroup {
  id: string;
  name: string;
  permission: Permission[];
}

class User {
  id: string;
  name: string;
  group: UserGroup;
  permission: Permission[];
}

class Capability {
  id: string;
  name: string;
}

class Permission {
  id: string;
  name: string;
}
