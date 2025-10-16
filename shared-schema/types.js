"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppTab = exports.GOVERNORATES = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["Voter"] = "Voter";
    UserRole["Candidate"] = "Candidate";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.GOVERNORATES = [
    'Al Anbar', 'Al-Qādisiyyah', 'Babil', 'Baghdad', 'Basra',
    'Dhi Qar', 'Diyala', 'Dohuk', 'Erbil', 'Karbala', 'Kirkuk',
    'Maysan', 'Muthanna', 'Najaf', 'Nineveh', 'Saladin',
    'Sulaymaniyah', 'Wasit',
];
var AppTab;
(function (AppTab) {
    AppTab["Home"] = "Home";
    AppTab["Posts"] = "Posts";
    AppTab["Reels"] = "Reels";
    AppTab["Candidates"] = "Candidates";
    AppTab["Debates"] = "Debates";
    AppTab["Events"] = "Events";
    AppTab["DebateRoom"] = "Debate Room";
    AppTab["Dashboard"] = "Dashboard";
    AppTab["Settings"] = "Settings";
    AppTab["CandidateProfile"] = "Candidate Profile";
})(AppTab || (exports.AppTab = AppTab = {}));
