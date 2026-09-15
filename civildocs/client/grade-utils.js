import { moneyNumber } from "./payment-utils.js";

export function normalizeGradePortfolio(data, source = {}) {
  data.companyName = source.companyName || data.companyName;
  data.currentGrade = source.currentGrade || data.currentGrade;
  data.targetGrade = source.targetGrade || data.targetGrade;
  data.yearsInOperation = Math.max(0, Number(source.yearsInOperation ?? data.yearsInOperation ?? 0) || 0);
  data.nccCategory = String(source.nccCategory || data.nccCategory || "").trim();
  data.nccRegistrationNumber = String(source.nccRegistrationNumber || data.nccRegistrationNumber || "").trim();
  data.applicationReference = String(source.applicationReference || data.applicationReference || "").trim();
  data.evidenceSummary = String(source.evidenceSummary || data.evidenceSummary || "").trim();
  data.completedProjects = (Array.isArray(source.completedProjects) && source.completedProjects.length ? source.completedProjects : data.completedProjects || []).map((project, index) => ({
    projectName: String(project.projectName || `Completed project ${index + 1}`).trim(),
    client: String(project.client || "Client to be confirmed").trim(),
    value: Math.max(0, moneyNumber(project.value)),
    year: String(project.year || "").trim(),
    completionCertificate: String(project.completionCertificate || "").trim(),
    evidenceReference: String(project.evidenceReference || "").trim(),
    evidenceStatus: ["Available", "Partial", "Missing"].includes(project.evidenceStatus) ? project.evidenceStatus : "Missing",
  }));
  data.technicalCapability = data.technicalCapability || source.staff;
  data.equipmentAndAssets = data.equipmentAndAssets || source.equipment;
  data.recommendedSupportingDocuments = (Array.isArray(data.recommendedSupportingDocuments) ? data.recommendedSupportingDocuments : [])
    .map(document => String(document || "").trim())
    .filter(Boolean);
  if (!data.recommendedSupportingDocuments.length) {
    data.recommendedSupportingDocuments = ["Bidder action: attach current NCC registration, project-completion evidence, and relevant staff and equipment records from your own files."];
  }

  const targetGrade = String(data.targetGrade || source.targetGrade || "").match(/(?:grade\s*)?([1-5])/i)?.[1] || "";
  const currentYear = new Date().getFullYear();
  const recentProjects = data.completedProjects.filter(project => {
    const year = Number(project.year);
    return Number.isFinite(year) && year >= currentYear - 5 && year <= currentYear;
  });
  const warnings = [];
  if ((targetGrade === "1" || targetGrade === "2") && recentProjects.length < 2) {
    warnings.push(`Eligibility warning: the NCC 2024 upgrade form states that applications for Grade ${targetGrade} should include two completed projects within the past five years. Only ${recentProjects.length} qualifying project${recentProjects.length === 1 ? " is" : "s are"} entered; verify the requirement before submission.`);
  }
  if ((targetGrade === "3" || targetGrade === "4" || targetGrade === "5") && recentProjects.length === 0) {
    warnings.push(`Eligibility warning: the NCC 2024 upgrade form requires completed-project evidence for a Grade ${targetGrade} upgrade. No project dated within the past five years is entered; verify the requirement before submission.`);
  }
  const incompleteEvidence = data.completedProjects.filter(project => project.evidenceStatus !== "Available");
  if (incompleteEvidence.length) warnings.push(`Evidence warning: ${incompleteEvidence.length} completed project${incompleteEvidence.length === 1 ? " is" : "s are"} marked Partial or Missing. Attach completion certificates, client references, and project evidence before submission.`);
  if (!data.nccCategory) warnings.push("Application warning: NCC category / class is not supplied; confirm the target category before submission.");
  data.dateCompiled = new Date().toISOString().slice(0, 10);
  data.applicationStatus = "Application support draft — NCC decision not represented";
  data.eligibilityWarnings = warnings;
  return data;
}

export function totalPortfolioValue(projects = []) {
  return moneyNumber(projects.reduce((sum, project) => {
    const value = Number(project.value);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0));
}

