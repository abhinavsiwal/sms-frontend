export const ROLES = {
    viewer: "VIEWER",
    editor: "EDITOR",
    owner: "OWNER"
  };
  
  export const SCOPES = {
    canCreate: "add",
    canEdit: "edit",
    canDelete: "delete",
    canView: "view"
  };
  

  
  export const PERMISSIONS = {
    [ROLES.viewer]: [SCOPES.canView],
    [ROLES.editor]: [SCOPES.canView, SCOPES.canEdit],
    [ROLES.owner]: [
      SCOPES.canView,
      SCOPES.canEdit,
      SCOPES.canCreate,
      SCOPES.canDelete
    ]
  };
  