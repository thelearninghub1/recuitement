// src/pages/GenerateReportsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaDownload, 
  FaFileExcel, 
  FaSearch, 
  FaFilter, 
  FaCheck, 
  FaSpinner,
  FaDatabase,
  FaSchool,
  FaUserGraduate,
  FaBriefcase,
  FaFileAlt,
  FaArrowLeft,
  FaEye,
  FaChartBar,
  FaColumns,
  FaChevronDown,
  FaChevronRight,
  FaCogs,
  FaUserFriends,
  FaCalendar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaCode,
  FaLanguage,
  FaMoneyBillWave,
  FaTag,
  FaListOl,
  FaFileSignature,
  FaIdCard,
  FaUserTie,
  FaBuilding,
  FaGlobe,
  FaUserClock
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { allUserAction } from '../../actions/userActions';
import { getJobs } from '../../actions/jobActions';
import * as XLSX from 'xlsx';

const GenerateReportsDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux states
  const allUsersState = useSelector((state) => state.allUsers);
  const allJobsState = useSelector((state) => state.allJobs);
  
  const { users = [] } = allUsersState || {};
  const { jobs = [] } = allJobsState || {};
  
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    candidates: [],
    schools: [],
    jobs: [],
    applications: []
  });
  
  // Selection states
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  
  // Expanded field selection states
  const [expandedSections, setExpandedSections] = useState({
    school: false,
    job: false,
    candidate: false
  });
  
  // Individual field selections
  const [schoolFields, setSchoolFields] = useState({
    name: true,
    email: true,
    phone: true,
    address: false,
    city: true,
    country: true,
    website: false,
    establishedYear: false,
    contactPerson: true,
    contactPosition: false,
    principalName: false,
    alternativeContact: false,
    schoolType: true,
    schoolLevel: false,
    curriculum: true,
    accreditation: false,
    facilities: false,
    immediateOpenings: true,
    expectedTeachers: true,
    staffingNeeds: true,
    hiringTimeline: false,
    salaryRange: true,
    benefits: false,
    status: true,
    joinDate: true,
    lastActive: false,
    totalJobs: true,
    partnershipInterest: false,
    additionalInfo: false
  });
  
  const [jobFields, setJobFields] = useState({
    title: true,
    category: true,
    jobType: true,
    location: true,
    schoolName: true,
    schoolEmail: false,
    schoolPhone: false,
    schoolCity: false,
    description: false,
    experienceRequired: true,
    careerLevel: false,
    minQualification: true,
    preferredNationality: false,
    gender: false,
    workMode: false,
    minSalary: true,
    maxSalary: true,
    salaryCurrency: true,
    applicationCount: true,
    viewCount: false,
    postedDate: true,
    applicationDeadline: true,
    status: true,
    skillsRequired: false,
    languagesRequired: false,
    curriculumExperience: false
  });
  
  const [candidateFields, setCandidateFields] = useState({
    name: true,
    email: true,
    phone: true,
    currentCity: true,
    countryOfResidence: true,
    nationality: true,
    willingRelocateCity: false,
    gender: false,
    dob: false,
    maritalStatus: false,
    iqama: false,
    degree: true,
    degreeOther: false,
    universityName: true,
    universityLocation: false,
    englishCert: false,
    teachingLicense: false,
    teachingDiploma: false,
    totalExperience: true,
    currentInstitution: false,
    previousInstitution: false,
    currentRole: false,
    skills: true,
    positionsInterested: true,
    curriculumTaught: true,
    subjectsTaught: false,
    languages: true,
    languagesOther: false,
    expectedSalary: true,
    availableFrom: false,
    status: true,
    profileCompletion: true,
    joinDate: true,
    lastActive: false,
    totalApplications: true,
    otherNotes: false
  });
  
  // UI states
  const [activeTab, setActiveTab] = useState('selection');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState({
    schools: [],
    jobs: [],
    candidates: []
  });
  const [generatingReport, setGeneratingReport] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(allUserAction()),
          dispatch(getJobs())
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data for reports');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);

  // Process data when users or jobs change
  useEffect(() => {
    if (users.length > 0 || jobs.length > 0) {
      processReportData();
    }
  }, [users, jobs]);

  // Process all data for reports
  const processReportData = () => {
    const candidates = users.filter(user => user.role === 'candidate')
      .map(candidate => ({
        id: candidate._id,
        name: `${candidate.profile?.firstName || ''} ${candidate.profile?.lastName || ''}`.trim() || 'Anonymous',
        email: candidate.email,
        phone: candidate.profile?.mobile || candidate.candidateData?.whatsapp,
        currentCity: candidate.candidateData?.currentCity,
        countryOfResidence: candidate.candidateData?.countryOfResidence,
        nationality: candidate.candidateData?.nationality,
        willingRelocateCity: candidate.candidateData?.willingRelocateCity,
        gender: candidate.candidateData?.gender,
        dob: candidate.candidateData?.dob,
        maritalStatus: candidate.candidateData?.maritalStatus,
        iqama: candidate.candidateData?.iqama,
        degree: candidate.candidateData?.degree,
        degreeOther: candidate.candidateData?.degreeOther,
        universityName: candidate.candidateData?.universityName,
        universityLocation: candidate.candidateData?.universityLocation,
        englishCert: candidate.candidateData?.englishCert,
        teachingLicense: candidate.candidateData?.teachingLicense,
        teachingDiploma: candidate.candidateData?.teachingDiploma,
        totalExperience: candidate.candidateData?.totalExperience,
        currentInstitution: candidate.candidateData?.currentInstitution,
        previousInstitution: candidate.candidateData?.previousInstitution,
        currentRole: candidate.candidateData?.positionsInterested?.[0],
        skills: candidate.candidateData?.skills || [],
        positionsInterested: candidate.candidateData?.positionsInterested || [],
        curriculumTaught: candidate.candidateData?.curriculumTaught || [],
        subjectsTaught: candidate.candidateData?.subjectsTaught || [],
        languages: candidate.candidateData?.languages || [],
        languagesOther: candidate.candidateData?.languagesOther,
        expectedSalary: candidate.candidateData?.expectedSalary,
        availableFrom: candidate.candidateData?.availableFrom,
        status: candidate.status || 'active',
        profileCompletion: calculateProfileCompletion(candidate),
        joinDate: candidate.createdAt,
        lastActive: candidate.updatedAt,
        otherNotes: candidate.candidateData?.otherNotes,
        applications: candidate.candidateData?.applications || []
      }));

    const schools = users.filter(user => user.role === 'school')
      .map(school => ({
        id: school._id,
        name: school.schoolData?.schoolName || `${school.profile?.firstName} ${school.profile?.lastName}`,
        email: school.email,
        phone: school.profile?.mobile || school.schoolData?.telephone,
        address: school.schoolData?.address,
        city: school.schoolData?.city,
        country: school.schoolData?.country,
        website: school.schoolData?.website,
        establishedYear: school.schoolData?.establishedYear,
        contactPerson: school.schoolData?.contactPerson,
        contactPosition: school.schoolData?.contactPosition,
        principalName: school.schoolData?.principalName,
        alternativeContact: school.schoolData?.alternativeContact,
        schoolType: school.schoolData?.schoolType || [],
        schoolLevel: school.schoolData?.schoolLevel || [],
        curriculum: school.schoolData?.curriculum || [],
        accreditation: school.schoolData?.accreditation,
        facilities: school.schoolData?.facilities,
        immediateOpenings: school.schoolData?.immediateOpenings,
        expectedTeachers: school.schoolData?.expectedTeachers,
        staffingNeeds: school.schoolData?.staffingNeeds || [],
        hiringTimeline: school.schoolData?.hiringTimeline,
        salaryRange: school.schoolData?.salaryRange,
        benefits: school.schoolData?.benefits,
        status: school.status,
        joinDate: school.createdAt,
        lastActive: school.updatedAt,
        totalJobs: 0,
        partnershipInterest: school.schoolData?.partnershipInterest,
        additionalInfo: school.schoolData?.additionalInfo,
        postedJobs: []
      }));

    const processedJobs = jobs.map(job => {
      const school = schools.find(s => s.id === job.school || s.id === job.school?._id);
      return {
        id: job._id,
        title: job.jobTitle,
        category: job.category,
        jobType: job.jobType,
        location: job.city || job.location,
        description: job.jobDescription,
        experienceRequired: job.experienceRequired,
        careerLevel: job.careerLevel,
        minQualification: job.minQualification,
        preferredNationality: job.preferredNationality,
        gender: job.gender,
        workMode: job.workMode,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        salaryCurrency: 'SAR',
        skillsRequired: job.skillsRequired || [],
        languagesRequired: job.languagesRequired || [],
        curriculumExperience: job.curriculumExperience || [],
        schoolId: job.school || job.school?._id,
        schoolName: school?.name || 'Unknown School',
        schoolEmail: school?.email,
        schoolPhone: school?.phone,
        schoolCity: school?.city,
        applicationCount: job.applicationCount || 0,
        viewCount: job.viewCount || 0,
        postedDate: job.createdAt,
        applicationDeadline: job.applicationDeadline,
        status: job.status,
        applications: job.applications || []
      };
    });

    schools.forEach(school => {
      const schoolJobs = processedJobs.filter(job => job.schoolId === school.id);
      school.postedJobs = schoolJobs;
      school.totalJobs = schoolJobs.length;
    });

    const applications = [];
    processedJobs.forEach(job => {
      if (job.applications && job.applications.length > 0) {
        job.applications.forEach(app => {
          const candidate = candidates.find(c => c.id === app.candidateId);
          applications.push({
            id: app._id || `${job.id}-${app.candidateId}`,
            jobId: job.id,
            jobTitle: job.title,
            schoolName: job.schoolName,
            candidateId: app.candidateId,
            candidateName: candidate?.name,
            candidateEmail: candidate?.email,
            applicationDate: app.appliedDate || app.createdAt,
            status: app.status || 'pending',
            resume: app.resume,
            coverLetter: app.coverLetter
          });
        });
      }
    });

    candidates.forEach(candidate => {
      candidate.totalApplications = candidate.applications.length;
    });

    setReportData({
      candidates,
      schools,
      jobs: processedJobs,
      applications
    });

    setFilteredData({
      schools,
      jobs: processedJobs,
      candidates
    });
  };

  const calculateProfileCompletion = (candidate) => {
    let score = 0;
    const totalFields = 10;
    if (candidate.profile?.firstName) score++;
    if (candidate.email) score++;
    if (candidate.profile?.mobile || candidate.candidateData?.whatsapp) score++;
    if (candidate.candidateData?.nationality) score++;
    if (candidate.candidateData?.degree) score++;
    if (candidate.candidateData?.totalExperience) score++;
    if (candidate.candidateData?.skills?.length > 0) score++;
    if (candidate.candidateData?.languages?.length > 0) score++;
    if (candidate.candidateData?.positionsInterested?.length > 0) score++;
    if (candidate.candidateData?.expectedSalary) score++;
    return Math.round((score / totalFields) * 100);
  };

  // Selection handlers
  const toggleSchoolSelection = (schoolId) => {
    setSelectedSchools(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev => 
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  // Field selection handlers
  const toggleSchoolField = (field) => {
    setSchoolFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleJobField = (field) => {
    setJobFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleCandidateField = (field) => {
    setCandidateFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Select all fields in section
  const selectAllSchoolFields = () => {
    const allFields = {};
    Object.keys(schoolFields).forEach(key => {
      allFields[key] = true;
    });
    setSchoolFields(allFields);
  };

  const clearAllSchoolFields = () => {
    const allFields = {};
    Object.keys(schoolFields).forEach(key => {
      allFields[key] = false;
    });
    setSchoolFields(allFields);
  };

  const selectAllJobFields = () => {
    const allFields = {};
    Object.keys(jobFields).forEach(key => {
      allFields[key] = true;
    });
    setJobFields(allFields);
  };

  const clearAllJobFields = () => {
    const allFields = {};
    Object.keys(jobFields).forEach(key => {
      allFields[key] = false;
    });
    setJobFields(allFields);
  };

  const selectAllCandidateFields = () => {
    const allFields = {};
    Object.keys(candidateFields).forEach(key => {
      allFields[key] = true;
    });
    setCandidateFields(allFields);
  };

  const clearAllCandidateFields = () => {
    const allFields = {};
    Object.keys(candidateFields).forEach(key => {
      allFields[key] = false;
    });
    setCandidateFields(allFields);
  };

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      setFilteredData({
        schools: reportData.schools.filter(school =>
          school.name.toLowerCase().includes(searchLower) ||
          school.email.toLowerCase().includes(searchLower) ||
          school.city?.toLowerCase().includes(searchLower)
        ),
        jobs: reportData.jobs.filter(job =>
          job.title.toLowerCase().includes(searchLower) ||
          job.schoolName.toLowerCase().includes(searchLower) ||
          job.category?.toLowerCase().includes(searchLower)
        ),
        candidates: reportData.candidates.filter(candidate =>
          candidate.name.toLowerCase().includes(searchLower) ||
          candidate.email.toLowerCase().includes(searchLower) ||
          candidate.currentCity?.toLowerCase().includes(searchLower)
        )
      });
    } else {
      setFilteredData({
        schools: reportData.schools,
        jobs: reportData.jobs,
        candidates: reportData.candidates
      });
    }
  }, [searchTerm, reportData]);

  // Direct export to Excel without preview
  const exportToExcel = () => {
    // Check if any data is selected
    if (selectedSchools.length === 0 && selectedJobs.length === 0 && selectedCandidates.length === 0) {
      toast.error('Please select at least one school, job, or candidate to generate a report');
      return;
    }

    setGeneratingReport(true);
    
    try {
      const wb = XLSX.utils.book_new();
      const timestamp = new Date().toISOString().split('T')[0];
      
      // Helper function to create styled sheet
      const createStyledSheet = (data, sheetName, headers) => {
        if (data.length === 0) return null;
        
        const wsData = [headers.map(h => h.header)];
        
        data.forEach(item => {
          const row = headers.map(header => item[header.key] || 'N/A');
          wsData.push(row);
        });
        
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        const colWidths = headers.map((header, index) => {
          const maxLength = Math.max(
            header.header.length,
            ...data.map(item => String(item[header.key] || '').length)
          );
          return { wch: Math.min(Math.max(maxLength, 10), 50) };
        });
        ws['!cols'] = colWidths;
        
        if (wsData[0]) {
          for (let col = 0; col < headers.length; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (ws[cellAddress]) {
              ws[cellAddress].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "2C3E50" } },
                alignment: { horizontal: "center", vertical: "center" }
              };
            }
          }
          
          for (let row = 1; row < wsData.length; row++) {
            for (let col = 0; col < headers.length; col++) {
              const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
              if (ws[cellAddress]) {
                const isEvenRow = row % 2 === 0;
                ws[cellAddress].s = {
                  fill: { fgColor: { rgb: isEvenRow ? "F8F9FA" : "FFFFFF" } },
                  alignment: { vertical: "center" },
                  border: {
                    top: { style: "thin", color: { rgb: "E0E0E0" } },
                    bottom: { style: "thin", color: { rgb: "E0E0E0" } },
                    left: { style: "thin", color: { rgb: "E0E0E0" } },
                    right: { style: "thin", color: { rgb: "E0E0E0" } }
                  }
                };
              }
            }
          }
        }
        
        return ws;
      };
      
      // 1. Schools Sheet
      if (selectedSchools.length > 0) {
        const selectedSchoolFields = Object.entries(schoolFields)
          .filter(([_, isSelected]) => isSelected)
          .map(([field]) => field);
        
        if (selectedSchoolFields.length > 0) {
          const schoolData = reportData.schools
            .filter(school => selectedSchools.includes(school.id))
            .map(school => {
              const row = {};
              selectedSchoolFields.forEach(field => {
                const value = school[field];
                row[field] = Array.isArray(value) ? value.join(', ') : value;
              });
              return row;
            });
          
          const schoolHeaders = selectedSchoolFields.map(field => ({
            key: field,
            header: field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
          }));
          
          const ws = createStyledSheet(schoolData, 'Schools', schoolHeaders);
          if (ws) XLSX.utils.book_append_sheet(wb, ws, 'Schools');
        }
      }
      
      // 2. Jobs Sheet
      if (selectedJobs.length > 0) {
        const selectedJobFields = Object.entries(jobFields)
          .filter(([_, isSelected]) => isSelected)
          .map(([field]) => field);
        
        if (selectedJobFields.length > 0) {
          const jobData = reportData.jobs
            .filter(job => selectedJobs.includes(job.id))
            .map(job => {
              const row = {};
              selectedJobFields.forEach(field => {
                const value = job[field];
                row[field] = Array.isArray(value) ? value.join(', ') : value;
              });
              return row;
            });
          
          const jobHeaders = selectedJobFields.map(field => ({
            key: field,
            header: field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
          }));
          
          const ws = createStyledSheet(jobData, 'Jobs', jobHeaders);
          if (ws) XLSX.utils.book_append_sheet(wb, ws, 'Jobs');
        }
      }
      
      // 3. Candidates Sheet
      if (selectedCandidates.length > 0) {
        const selectedCandidateFields = Object.entries(candidateFields)
          .filter(([_, isSelected]) => isSelected)
          .map(([field]) => field);
        
        if (selectedCandidateFields.length > 0) {
          const candidateData = reportData.candidates
            .filter(candidate => selectedCandidates.includes(candidate.id))
            .map(candidate => {
              const row = {};
              selectedCandidateFields.forEach(field => {
                const value = candidate[field];
                row[field] = Array.isArray(value) ? value.join(', ') : value;
              });
              return row;
            });
          
          const candidateHeaders = selectedCandidateFields.map(field => ({
            key: field,
            header: field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
          }));
          
          const ws = createStyledSheet(candidateData, 'Candidates', candidateHeaders);
          if (ws) XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
        }
      }
      
      // 4. Applications Sheet
      const selectedJobIds = new Set(selectedJobs);
      const selectedCandidateIds = new Set(selectedCandidates);
      
      const applicationData = reportData.applications
        .filter(app => 
          selectedJobIds.has(app.jobId) || 
          selectedCandidateIds.has(app.candidateId)
        )
        .map(app => ({
          'Job Title': app.jobTitle,
          'School': app.schoolName,
          'Candidate Name': app.candidateName,
          'Candidate Email': app.candidateEmail,
          'Application Date': formatDateForExcel(app.applicationDate),
          'Status': app.status
        }));
      
      if (applicationData.length > 0) {
        const appHeaders = [
          { key: 'Job Title', header: 'Job Title' },
          { key: 'School', header: 'School' },
          { key: 'Candidate Name', header: 'Candidate Name' },
          { key: 'Candidate Email', header: 'Candidate Email' },
          { key: 'Application Date', header: 'Application Date' },
          { key: 'Status', header: 'Status' }
        ];
        
        const ws = createStyledSheet(applicationData, 'Applications', appHeaders);
        if (ws) XLSX.utils.book_append_sheet(wb, ws, 'Applications');
      }
      
      // 5. Summary Sheet
      const totalSchoolsSelected = selectedSchools.length;
      const totalJobsSelected = selectedJobs.length;
      const totalCandidatesSelected = selectedCandidates.length;
      const totalApplicationsSelected = reportData.applications.filter(app => 
        selectedJobIds.has(app.jobId) || selectedCandidateIds.has(app.candidateId)
      ).length;
      
      const summaryData = [
        ['TeachMe Recruitment Report', '', '', '', ''],
        ['Generated on:', new Date().toLocaleString(), '', '', ''],
        ['', '', '', '', ''],
        ['SUMMARY STATISTICS', '', '', '', ''],
        ['Total Schools', totalSchoolsSelected, '', '', ''],
        ['Total Jobs', totalJobsSelected, '', '', ''],
        ['Total Candidates', totalCandidatesSelected, '', '', ''],
        ['Total Applications', totalApplicationsSelected, '', '', ''],
        ['', '', '', '', ''],
        ['REPORT DETAILS', '', '', '', ''],
        ['Data Source', 'TeachMe System', '', '', ''],
        ['Report Type', 'Comprehensive Recruitment Report', '', '', ''],
        ['Export Date', timestamp, '', '', ''],
        ['', '', '', '', ''],
        ['SELECTION DETAILS', '', '', '', ''],
        ['Schools Selected', totalSchoolsSelected, '', '', ''],
        ['Jobs Selected', totalJobsSelected, '', '', ''],
        ['Candidates Selected', totalCandidatesSelected, '', '', '']
      ];
      
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      wsSummary['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      
      const styleCells = (range, style) => {
        const [start, end] = range.split(':').map(XLSX.utils.decode_cell);
        for (let R = start.r; R <= end.r; ++R) {
          for (let C = start.c; C <= end.c; ++C) {
            const cell = XLSX.utils.encode_cell({ r: R, c: C });
            if (!wsSummary[cell]) wsSummary[cell] = { v: '', t: 's' };
            wsSummary[cell].s = style;
          }
        }
      };
      
      styleCells('A1:E1', {
        font: { bold: true, size: 16, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "3498DB" } },
        alignment: { horizontal: "center", vertical: "center" }
      });
      
      styleCells('A4:E4', {
        font: { bold: true, size: 14, color: { rgb: "2C3E50" } },
        fill: { fgColor: { rgb: "ECF0F1" } },
        alignment: { horizontal: "center", vertical: "center" }
      });
      
      styleCells('A10:E10', {
        font: { bold: true, size: 14, color: { rgb: "2C3E50" } },
        fill: { fgColor: { rgb: "ECF0F1" } },
        alignment: { horizontal: "center", vertical: "center" }
      });
      
      styleCells('A14:E14', {
        font: { bold: true, size: 14, color: { rgb: "2C3E50" } },
        fill: { fgColor: { rgb: "ECF0F1" } },
        alignment: { horizontal: "center", vertical: "center" }
      });
      
      for (let i = 5; i <= 8; i++) {
        styleCells(`A${i}:B${i}`, {
          font: { bold: true },
          fill: { fgColor: { rgb: i % 2 === 0 ? "F8F9FA" : "FFFFFF" } },
          border: {
            top: { style: "thin", color: { rgb: "E0E0E0" } },
            bottom: { style: "thin", color: { rgb: "E0E0E0" } },
            left: { style: "thin", color: { rgb: "E0E0E0" } },
            right: { style: "thin", color: { rgb: "E0E0E0" } }
          }
        });
      }
      
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
      
      const filename = `TeachMe_Report_${timestamp}.xlsx`;
      XLSX.writeFile(wb, filename);
      toast.success(`Report exported to ${filename}!`);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export report to Excel');
    } finally {
      setGeneratingReport(false);
    }
  };

  const formatDateForExcel = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Select all/none helpers
  const selectAllSchools = () => {
    setSelectedSchools(filteredData.schools.map(school => school.id));
  };

  const clearAllSchools = () => {
    setSelectedSchools([]);
  };

  const selectAllJobs = () => {
    setSelectedJobs(filteredData.jobs.map(job => job.id));
  };

  const clearAllJobs = () => {
    setSelectedJobs([]);
  };

  const selectAllCandidates = () => {
    setSelectedCandidates(filteredData.candidates.map(candidate => candidate.id));
  };

  const clearAllCandidates = () => {
    setSelectedCandidates([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Generate Reports</h1>
              <p className="text-gray-600">Create beautiful Excel reports with selected data</p>
            </div>
            <button
              onClick={() => navigate('/system-admin-dashboard')}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg flex items-center hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Simple Tabs - removed preview tab */}
        <div className="flex border-b border-gray-200 mb-8 bg-white rounded-t-xl">
          <button
            className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'selection' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('selection')}
          >
            <FaDatabase /> Data Selection
          </button>
          <button
            className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'fields' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('fields')}
          >
            <FaColumns /> Field Selection
          </button>
          <button
            className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'export' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('export')}
          >
            <FaFileExcel /> Export Report
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools, jobs, and candidates..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Selection Tab */}
        {activeTab === 'selection' && (
          <div className="space-y-8">
            {/* Schools Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaSchool className="text-blue-500" />
                  Schools ({filteredData.schools.length})
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {selectedSchools.length} selected
                  </span>
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllSchools}
                    className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllSchools}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                {filteredData.schools.map(school => (
                  <div
                    key={school.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedSchools.includes(school.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'}`}
                    onClick={() => toggleSchoolSelection(school.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{school.name}</h3>
                        <p className="text-sm text-gray-600">{school.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{school.city}, {school.country}</p>
                      </div>
                      {selectedSchools.includes(school.id) ? (
                        <FaCheck className="text-green-500 text-lg" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {school.totalJobs || 0} jobs
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {school.immediateOpenings || 0} openings
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaBriefcase className="text-orange-500" />
                  Jobs ({filteredData.jobs.length})
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {selectedJobs.length} selected
                  </span>
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllJobs}
                    className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllJobs}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                {filteredData.jobs.map(job => (
                  <div
                    key={job.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedJobs.includes(job.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'}`}
                    onClick={() => toggleJobSelection(job.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.schoolName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {job.jobType} • {job.location} • {job.applicationCount} applications
                        </p>
                      </div>
                      {selectedJobs.includes(job.id) ? (
                        <FaCheck className="text-green-500 text-lg" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidates Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaUserGraduate className="text-purple-500" />
                  Candidates ({filteredData.candidates.length})
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {selectedCandidates.length} selected
                  </span>
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllCandidates}
                    className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllCandidates}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                {filteredData.candidates.map(candidate => (
                  <div
                    key={candidate.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedCandidates.includes(candidate.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'}`}
                    onClick={() => toggleCandidateSelection(candidate.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {candidate.currentCity} • {candidate.degree}
                        </p>
                      </div>
                      {selectedCandidates.includes(candidate.id) ? (
                        <FaCheck className="text-green-500 text-lg" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {candidate.totalApplications || 0} applications
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        {candidate.profileCompletion || 0}% complete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Field Selection Tab */}
        {activeTab === 'fields' && (
          <div className="space-y-8">
            {/* Schools Fields */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaSchool className="text-blue-500" />
                  School Fields
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {Object.values(schoolFields).filter(v => v).length} selected
                  </span>
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllSchoolFields}
                    className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllSchoolFields}
                    className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => toggleSection('school')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-4"
              >
                <span className="font-medium text-gray-700">Click to expand/collapse all fields</span>
                {expandedSections.school ? (
                  <FaChevronDown className="text-gray-500" />
                ) : (
                  <FaChevronRight className="text-gray-500" />
                )}
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(schoolFields).map(([field, isSelected]) => (
                  <label key={field} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSchoolField(field)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Jobs Fields */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaBriefcase className="text-orange-500" />
                  Job Fields
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {Object.values(jobFields).filter(v => v).length} selected
                  </span>
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllJobFields}
                    className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllJobFields}
                    className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => toggleSection('job')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-4"
              >
                <span className="font-medium text-gray-700">Click to expand/collapse all fields</span>
                {expandedSections.job ? (
                  <FaChevronDown className="text-gray-500" />
                ) : (
                  <FaChevronRight className="text-gray-500" />
                )}
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(jobFields).map(([field, isSelected]) => (
                  <label key={field} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleJobField(field)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Candidates Fields */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaUserGraduate className="text-purple-500" />
                  Candidate Fields
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {Object.values(candidateFields).filter(v => v).length} selected
                  </span>
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllCandidateFields}
                    className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllCandidateFields}
                    className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => toggleSection('candidate')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-4"
              >
                <span className="font-medium text-gray-700">Click to expand/collapse all fields</span>
                {expandedSections.candidate ? (
                  <FaChevronDown className="text-gray-500" />
                ) : (
                  <FaChevronRight className="text-gray-500" />
                )}
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(candidateFields).map(([field, isSelected]) => (
                  <label key={field} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCandidateField(field)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Export Tab - Direct download without preview */}
        {activeTab === 'export' && (
          <div className="space-y-8">
            {/* Selection Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Report Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{selectedSchools.length}</div>
                  <div className="text-sm font-medium text-blue-800">Schools Selected</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Out of {filteredData.schools.length} total
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600">{selectedJobs.length}</div>
                  <div className="text-sm font-medium text-orange-800">Jobs Selected</div>
                  <div className="text-xs text-orange-600 mt-1">
                    Out of {filteredData.jobs.length} total
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">{selectedCandidates.length}</div>
                  <div className="text-sm font-medium text-purple-800">Candidates Selected</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Out of {filteredData.candidates.length} total
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    {reportData.applications.filter(app => 
                      selectedJobs.includes(app.jobId) || selectedCandidates.includes(app.candidateId)
                    ).length}
                  </div>
                  <div className="text-sm font-medium text-green-800">Applications</div>
                  <div className="text-xs text-green-600 mt-1">
                    Related to selected data
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Fields Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Fields Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaSchool className="text-blue-500" />
                    <span className="font-medium text-blue-700">School Fields</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Object.values(schoolFields).filter(v => v).length} of {Object.keys(schoolFields).length} fields selected
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaBriefcase className="text-orange-500" />
                    <span className="font-medium text-orange-700">Job Fields</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Object.values(jobFields).filter(v => v).length} of {Object.keys(jobFields).length} fields selected
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUserGraduate className="text-purple-500" />
                    <span className="font-medium text-purple-700">Candidate Fields</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Object.values(candidateFields).filter(v => v).length} of {Object.keys(candidateFields).length} fields selected
                  </p>
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <FaFileExcel className="text-3xl text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Export to Beautiful Excel Report</h3>
                <p className="text-gray-600 mt-2">
                  Generate a professionally formatted Excel file with multiple sheets and styling
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border">
                  <h4 className="font-semibold text-gray-800 mb-3">Report Includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      Multiple sheets (Schools, Jobs, Candidates, Applications, Summary)
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      Professionally styled headers and cells
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      Auto-adjusted column widths
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      Alternating row colors for readability
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      Timestamp in filename
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl border">
                  <h4 className="font-semibold text-gray-800 mb-3">File Details:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Filename:</span>
                      <span className="font-medium text-gray-800">TeachMe_Report_{new Date().toISOString().split('T')[0]}.xlsx</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sheets:</span>
                      <span className="font-medium text-gray-800">Up to 5 sheets</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium text-gray-800">Microsoft Excel (.xlsx)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Records:</span>
                      <span className="font-medium">{selectedSchools.length + selectedJobs.length + selectedCandidates.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={exportToExcel}
                  disabled={generatingReport || (selectedSchools.length === 0 && selectedJobs.length === 0 && selectedCandidates.length === 0)}
                  className={`px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-3 mx-auto transition-all ${generatingReport || (selectedSchools.length === 0 && selectedJobs.length === 0 && selectedCandidates.length === 0) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'}`}
                >
                  {generatingReport ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Generating Excel Report...
                    </>
                  ) : (
                    <>
                      <FaFileExcel className="text-xl" />
                      Generate & Download Report
                    </>
                  )}
                </button>
                {(selectedSchools.length === 0 && selectedJobs.length === 0 && selectedCandidates.length === 0) && (
                  <p className="text-sm text-red-500 mt-4">
                    Please select at least one school, job, or candidate in the Data Selection tab
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-4">
                  The report will be downloaded automatically as an Excel file
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReportsDashboard;