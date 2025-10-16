import type { IraqiCandidate } from './candidateService';

class VerificationService {
  async verifyCandidatePage(candidate: IraqiCandidate, pageInfo: any): Promise<{
    isAuthentic: boolean;
    confidence: number;
    reasons: string[];
  }> {
    const reasons: string[] = [];
    let confidence = 0;

    const nameSimilarity = this.calculateNameSimilarity(candidate.name, pageInfo.name ?? '');
    if (nameSimilarity > 0.8) {
      confidence += 30;
      reasons.push('Name matches candidate');
    }

    if (await this.verifyLocation(candidate, pageInfo)) {
      confidence += 20;
      reasons.push('Location consistent');
    }

    if (pageInfo.category === 'Politician' || pageInfo.category === 'Public Figure') {
      confidence += 15;
      reasons.push('Appropriate page category');
    }

    if (pageInfo.verification_status === 'blue_verified') {
      confidence += 25;
      reasons.push('Verified page');
    }

    if ((pageInfo.posts_count ?? 0) > 5) {
      confidence += 10;
      reasons.push('Active page');
    }

    return {
      isAuthentic: confidence > 60,
      confidence,
      reasons,
    };
  }

  private calculateNameSimilarity(candidateName: string, pageName: string): number {
    if (!candidateName || !pageName) {
      return 0;
    }

    const candidateWords = candidateName.toLowerCase().split(/\s+/).filter(Boolean);
    const pageWords = pageName.toLowerCase().split(/\s+/).filter(Boolean);

    if (candidateWords.length === 0) {
      return 0;
    }

    let matches = 0;
    candidateWords.forEach(word => {
      if (pageWords.some(pageWord => pageWord.includes(word) || word.includes(pageWord))) {
        matches += 1;
      }
    });

    return matches / candidateWords.length;
  }

  private async verifyLocation(candidate: IraqiCandidate, pageInfo: any): Promise<boolean> {
    const locationKeywords = [
      candidate.district.toLowerCase(),
      candidate.province.toLowerCase(),
      'iraq',
      'العراق',
    ].filter(Boolean);

    const pageAbout = (pageInfo.about || '').toLowerCase();

    return locationKeywords.some(keyword => pageAbout.includes(keyword));
  }
}

export default VerificationService;
