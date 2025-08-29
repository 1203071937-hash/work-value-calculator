/**
 * 体验计算器模块
 * 负责计算工作体验相关的各项指标
 */
export class ExperienceCalculator {
    constructor() {
        // 体验指标权重配置
        this.experienceWeights = {
            housingSatisfaction: 0.25,      // 住房获得感
            consumptionSatisfaction: 0.20,  // 消费获得感
            transportSatisfaction: 0.15,    // 交通获得感
            lifeAtmosphere: 0.20,           // 生活氛围体验度
            workAtmosphere: 0.20            // 工作氛围体验感
        };
    }
    
    /**
     * 计算体验指数
     * @param {Object} data - 体验相关数据
     * @returns {Object} 体验指数计算结果
     */
    calculateExperienceIndex(data) {
        const {
            housingSatisfaction,      // 住房获得感 (1-10)
            consumptionSatisfaction,  // 消费获得感 (1-10)
            transportSatisfaction,    // 交通获得感 (1-10)
            lifeAtmosphere,           // 生活氛围体验度 (1-10)
            workAtmosphere            // 工作氛围体验感 (1-10)
        } = data;
        
        // 验证输入值范围
        const validatedData = this.validateExperienceData(data);
        
        // 计算加权体验指数
        let experienceIndex = 0;
        Object.keys(this.experienceWeights).forEach(key => {
            experienceIndex += validatedData[key] * this.experienceWeights[key];
        });
        
        // 转换为百分制
        experienceIndex = experienceIndex * 10;
        
        return {
            experienceIndex: Math.round(experienceIndex * 100) / 100,
            weightedScores: {
                housingSatisfaction: Math.round(validatedData.housingSatisfaction * 10 * 100) / 100,
                consumptionSatisfaction: Math.round(validatedData.consumptionSatisfaction * 10 * 100) / 100,
                transportSatisfaction: Math.round(validatedData.transportSatisfaction * 10 * 100) / 100,
                lifeAtmosphere: Math.round(validatedData.lifeAtmosphere * 10 * 100) / 100,
                workAtmosphere: Math.round(validatedData.workAtmosphere * 10 * 100) / 100
            },
            weights: this.experienceWeights,
            breakdown: validatedData
        };
    }
    
    /**
     * 验证体验数据
     * @param {Object} data - 体验数据
     * @returns {Object} 验证后的数据
     */
    validateExperienceData(data) {
        const validated = {};
        Object.keys(data).forEach(key => {
            let value = parseFloat(data[key]) || 5; // 默认值为5
            value = Math.max(1, Math.min(10, value)); // 限制在1-10范围内
            validated[key] = value;
        });
        return validated;
    }
    
    /**
     * 获取体验评价
     * @param {number} experienceIndex - 体验指数
     * @returns {string} 体验评价
     */
    getExperienceEvaluation(experienceIndex) {
        if (experienceIndex >= 90) return "极佳体验，工作生活平衡完美！";
        if (experienceIndex >= 80) return "优秀体验，整体满意度很高！";
        if (experienceIndex >= 70) return "良好体验，大部分方面令人满意！";
        if (experienceIndex >= 60) return "一般体验，有提升空间！";
        if (experienceIndex >= 50) return "较差体验，需要改善！";
        return "很差体验，建议重新考虑！";
    }
    
    /**
     * 获取体验指数权重
     * @returns {number} 权重值
     */
    getWeight() {
        return 0.20; // 体验指数占总分的20%
    }
}

