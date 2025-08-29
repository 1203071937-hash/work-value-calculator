/**
 * 成本计算器模块
 * 负责计算生活成本相关的各项指标
 */
export class CostCalculator {
    constructor() {
        // 标准生活成本配置
        this.standardRent = 2000;
        this.standardFood = 1500;
        this.standardTransport = 500;
    }
    
    /**
     * 计算成本指数
     * @param {Object} data - 成本相关数据
     * @returns {Object} 成本指数计算结果
     */
    calculateCostIndex(data) {
        const {
            rent,             // 房租
            food,             // 饮食
            transport,        // 交通
            city              // 城市（用于成本调整）
        } = data;
        
        // 计算总成本
        const totalCost = rent + food + transport;
        
        // 计算成本指数（基准值4000元）
        const baseCost = 4000;
        let costIndex = (totalCost / baseCost) * 100;
        
        // 应用城市成本调整系数
        const cityCostFactor = this.getCityCostFactor(city);
        costIndex = costIndex * cityCostFactor;
        
        return {
            costIndex: Math.round(costIndex * 100) / 100,
            totalCost: Math.round(totalCost * 100) / 100,
            cityCostFactor,
            breakdown: {
                rent: Math.round(rent * 100) / 100,
                food: Math.round(food * 100) / 100,
                transport: Math.round(transport * 100) / 100
            },
            costRatio: {
                rentRatio: Math.round((rent / totalCost) * 100),
                foodRatio: Math.round((food / totalCost) * 100),
                transportRatio: Math.round((transport / totalCost) * 100)
            }
        };
    }
    
    /**
     * 获取城市成本调整系数
     * @param {string} city - 城市名称
     * @returns {number} 成本调整系数
     */
    getCityCostFactor(city) {
        const cityCostFactors = {
            '北京': 1.2,
            '上海': 1.2,
            '深圳': 1.1,
            '广州': 1.0,
            '杭州': 0.9,
            '成都': 0.8,
            '武汉': 0.8,
            '西安': 0.7,
            '其他': 0.6
        };
        
        return cityCostFactors[city] || 1.0;
    }
    
    /**
     * 计算成本效益比
     * @param {number} income - 收入
     * @param {number} cost - 成本
     * @returns {number} 成本效益比
     */
    calculateCostBenefitRatio(income, cost) {
        if (cost === 0) return 0;
        return Math.round((income / cost) * 100) / 100;
    }
    
    /**
     * 获取成本指数权重
     * @returns {number} 权重值
     */
    getWeight() {
        return 0.20; // 成本指数占总分的20%
    }
}

