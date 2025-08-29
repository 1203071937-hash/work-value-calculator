/**
 * 工作强度计算器模块
 * 负责计算工作强度相关的各项指标
 */
export class WorkCalculator {
    constructor() {
        // 标准工作时间配置
        this.standardWorkHours = 8;
        this.standardCommuteHours = 1;
        this.standardWorkIntensity = 3;
        this.standardWorkDays = 5;
    }
    
    /**
     * 计算工作指数
     * @param {Object} data - 工作相关数据
     * @returns {Object} 工作指数计算结果
     */
    calculateWorkIndex(data) {
        const {
            workStart,        // 上班时间
            workEnd,          // 下班时间
            commuteTime,      // 通勤时间（分钟）
            overtimeFreq,     // 加班频率
            overtimeHours,    // 加班时间
            workIntensity,    // 工作强度
            workDays,         // 工作天数
            age               // 年龄
        } = data;
        
        // 计算工作时长（小时）
        const workHours = workEnd - workStart;
        
        // 计算通勤时间（小时，来回双程）
        const commuteHours = (commuteTime * 2) / 60;
        
        // 计算时间成本指数
        const timeCostIndex = this.calculateTimeCostIndex(workHours, commuteHours);
        
        // 计算强度成本指数
        const intensityCostIndex = this.calculateIntensityCostIndex(workIntensity);
        
        // 计算加班成本指数
        const overtimeCostIndex = this.calculateOvertimeCostIndex(overtimeFreq, overtimeHours);
        
        // 计算工作天数调整系数
        const workDaysFactor = workDays / this.standardWorkDays;
        
        // 计算年龄调整系数
        const ageFactor = this.calculateAgeFactor(age);
        
        // 计算总工作指数
        const workIndex = (timeCostIndex + intensityCostIndex + overtimeCostIndex) * 
                         ageFactor * workDaysFactor / 10;
        
        return {
            workIndex: Math.max(1, Math.round(workIndex * 100) / 100),
            timeCostIndex: Math.round(timeCostIndex * 100) / 100,
            intensityCostIndex: Math.round(intensityCostIndex * 100) / 100,
            overtimeCostIndex: Math.round(overtimeCostIndex * 100) / 100,
            workDaysFactor: Math.round(workDaysFactor * 100) / 100,
            ageFactor: Math.round(ageFactor * 100) / 100,
            breakdown: {
                workHours,
                commuteHours,
                workDays,
                age
            }
        };
    }
    
    /**
     * 计算时间成本指数
     * @param {number} workHours - 工作时长
     * @param {number} commuteHours - 通勤时长
     * @returns {number} 时间成本指数
     */
    calculateTimeCostIndex(workHours, commuteHours) {
        const totalTime = workHours + commuteHours;
        const standardTime = this.standardWorkHours + this.standardCommuteHours;
        
        return (totalTime / standardTime) * 30;
    }
    
    /**
     * 计算强度成本指数
     * @param {number} workIntensity - 工作强度
     * @returns {number} 强度成本指数
     */
    calculateIntensityCostIndex(workIntensity) {
        return (workIntensity / this.standardWorkIntensity) * 20;
    }
    
    /**
     * 计算加班成本指数
     * @param {number} overtimeFreq - 加班频率
     * @param {number} overtimeHours - 加班时长
     * @returns {number} 加班成本指数
     */
    calculateOvertimeCostIndex(overtimeFreq, overtimeHours) {
        const overtimeTotal = overtimeFreq + overtimeHours;
        const divisor = Math.max(0.1, overtimeTotal);
        
        return (overtimeTotal / divisor) * 10;
    }
    
    /**
     * 计算年龄调整系数
     * @param {number} age - 年龄
     * @returns {number} 年龄调整系数
     */
    calculateAgeFactor(age) {
        // 以25岁为基准，年龄越大对工作强度的承受能力可能越低
        return 1 + (age - 25) * 0.02;
    }
    
    /**
     * 获取工作指数权重
     * @returns {number} 权重值
     */
    getWeight() {
        return 0.25; // 工作指数占总分的25%
    }
}

