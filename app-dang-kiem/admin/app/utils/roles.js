function scopedProjects(user) {
  return user.role_id === 2;
}

function canCreateProject(functions) {
  return functions.create1 === 1;
}
function canUpdateProject(functions) {
  return functions.update1 === 1;
}
function canDeleteProject(functions) {
  return functions.delete1 === 1;
}
function canViewProject(functions) {
  return functions.read1 === 1;
}

module.exports = {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  scopedProjects,
  canDeleteProject,
};
