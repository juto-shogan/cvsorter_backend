// src/services/cvAnalyzer.js

// --- CV Keywords and Analysis Data (Moved here from a hypothetical cvKeywords.js) ---
const jobRoleKeywords = {
  'software developer': {
    keywords: ['java', 'python', 'javascript', 'react', 'node.js', 'sql', 'html', 'css', 'git', 'agile', 'frontend', 'backend', 'fullstack', 'api'],
    min_score: 50,
    soft_skills: ['problem-solving', 'attention to detail', 'collaboration', 'communication'],
    experience_levels: ['junior', 'mid-level', 'senior'],
    related_roles: ['web developer', 'mobile developer', 'backend engineer', 'frontend engineer'],
    potential_needs: ['data structures', 'algorithms', 'system design']
  },
  'data scientist': {
    keywords: ['python', 'r', 'sql', 'machine learning', 'deep learning', 'statistics', 'tableau', 'power bi', 'aws', 'azure', 'gcp', 'data visualization', 'nlp', 'pandas', 'numpy'],
    min_score: 55,
    soft_skills: ['analytical thinking', 'curiosity', 'communication', 'problem-solving'],
    experience_levels: ['entry-level', 'associate', 'lead'],
    related_roles: ['machine learning engineer', 'data analyst', 'statistician'],
    potential_needs: ['big data', 'cloud computing', 'A/B testing']
  },
  'customer service': {
    keywords: ['customer support', 'troubleshooting', 'communication', 'problem-solving', 'empathy', 'crm', 'ticketing system', 'call center', 'help desk', 'active listening'],
    min_score: 40,
    soft_skills: ['patience', 'interpersonal skills', 'conflict resolution', 'adaptability'],
    experience_levels: ['associate', 'specialist', 'team lead'],
    related_roles: ['support agent', 'client representative'],
    potential_needs: ['product knowledge', 'escalation procedures']
  },
  'cyber security': {
    keywords: ['network security', 'information security', 'firewall', 'intrusion detection', 'vulnerability assessment', 'encryption', 'compliance', 'incident response', 'siem', 'forensics', 'linux', 'cloud security'],
    min_score: 60,
    soft_skills: ['critical thinking', 'attention to detail', 'problem-solving', 'adaptability'],
    experience_levels: ['analyst', 'engineer', 'architect'],
    related_roles: ['security analyst', 'infosec specialist'],
    potential_needs: ['penetration testing', 'risk management', 'threat intelligence']
  }
  // Add more job roles and their associated keywords/criteria here
};

// --- End of CV Keywords and Analysis Data ---


class CVAnalyzer {

  /**
   * Analyzes the extracted text of a CV to determine candidate details, skills, experience, and score.
   * This method now expects pre-extracted text.
   * @param {string} extractedText - The full text content extracted from the CV.
   * @param {string} originalFilename - The original name of the CV file.
   * @returns {Object} An object containing the analysis results.
   */
  async analyzeCV(extractedText, originalFilename) {
    console.log("Starting CV analysis for:", originalFilename);
    const content = extractedText.toLowerCase(); // Work with lowercase content for easier matching

    // Step 1: Determine the best role based on keywords
    let bestRole = "General Applicant";
    let roleDetails = jobRoleKeywords['software developer']; // Default or fallback role details
    let maxMatchCount = 0;

    for (const role in jobRoleKeywords) {
      const currentRoleDetails = jobRoleKeywords[role];
      let currentMatchCount = 0;
      currentRoleDetails.keywords.forEach(keyword => {
        if (content.includes(keyword.toLowerCase())) {
          currentMatchCount++;
        }
      });

      // Also check for soft skills as a bonus
      currentRoleDetails.soft_skills.forEach(skill => {
        if (content.includes(skill.toLowerCase())) {
          currentMatchCount += 0.5; // Give soft skills a slightly lower weight
        }
      });

      if (currentMatchCount > maxMatchCount) {
        maxMatchCount = currentMatchCount;
        bestRole = role;
        roleDetails = currentRoleDetails;
      }
    }

    console.log(`Determined best role: ${bestRole} (Matches: ${maxMatchCount})`);

    // Step 2: Perform CV checking against the determined role's keywords
    let matchedKeywords = [];
    let keywordCount = 0;
    if (roleDetails && roleDetails.keywords) {
      roleDetails.keywords.forEach(keyword => {
        if (content.includes(keyword.toLowerCase())) {
          matchedKeywords.push(keyword);
          keywordCount++;
        }
      });
    }

    // Step 3: Grade the CV
    let totalScore = 0;
    if (roleDetails && roleDetails.min_score) {
        totalScore = Math.min((keywordCount / roleDetails.keywords.length) * 100, 100); // Basic scoring
        // Add more sophisticated grading based on your Python logic (soft skills, experience, etc.)
        
        // Example: Add points for presence of soft skills
        if (roleDetails.soft_skills) {
            roleDetails.soft_skills.forEach(skill => {
                if (content.includes(skill.toLowerCase())) {
                    totalScore += 2; // Small bonus for each matched soft skill
                }
            });
        }
        totalScore = Math.min(totalScore, 100); // Cap score at 100
    }


    // Step 4: Extract specific candidate details (requires more advanced regex/NLP)
    // This part requires more robust implementation based on your main.py's extraction
    let candidateName = "Unknown Candidate";
    let email = "N/A";
    let phone = "N/A";
    let experience = 0;
    let education = "Not Specified";
    let location = "Not Specified";
    let skills = matchedKeywords; // For simplicity, using matched keywords as skills

    // Basic regex examples - make these more robust!
    const nameMatch = extractedText.match(/Name:\s*([A-Za-z\s]+)/i); // Very basic, needs refinement
    if (nameMatch && nameMatch[1]) candidateName = nameMatch[1].trim();
    
    const emailMatch = extractedText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch && emailMatch[0]) email = emailMatch[0];

    const phoneMatch = extractedText.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
    if (phoneMatch && phoneMatch[0]) phone = phoneMatch[0];

    const experienceMatch = extractedText.match(/(\d+)\s*years?/i);
    if (experienceMatch && experienceMatch[1]) experience = Number(experienceMatch[1]);

    // Status logic (e.g., if score is below min_score, set to 'rejected' or 'under review')
    let status = totalScore >= (roleDetails ? roleDetails.min_score : 0) ? "reviewed" : "rejected"; 
    if (totalScore >= 75) status = "approved";
    else if (totalScore < 50) status = "rejected";


    return {
      candidateName,
      position: bestRole, // Use the determined best role
      experience,
      skills, // This can be refined further (e.g., specific skill extraction)
      education,
      location,
      phone,
      email,
      totalScore,
      status // Initial status, can be changed later
    };
  }
}

export default new CVAnalyzer();