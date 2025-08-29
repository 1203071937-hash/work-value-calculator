/**
 * 收入计算器模块
 * 负责计算工作收入相关的各项指标
 */
export class IncomeCalculator {
    constructor() {
        // 全国主要城市按省份分层
        this.cityData = {
            '华北地区': {
                '北京': { factor: 0.7, level: '超一线城市' },
                '天津': { factor: 0.8, level: '一线城市' },
                '石家庄': { factor: 1.0, level: '二线城市' },
                '太原': { factor: 1.0, level: '二线城市' },
                '呼和浩特': { factor: 1.1, level: '二线城市' }
            },
            '华东地区': {
                '上海': { factor: 0.7, level: '超一线城市' },
                '南京': { factor: 0.9, level: '新一线城市' },
                '杭州': { factor: 0.9, level: '新一线城市' },
                '宁波': { factor: 1.0, level: '二线城市' },
                '苏州': { factor: 0.95, level: '新一线城市' },
                '无锡': { factor: 1.0, level: '二线城市' },
                '常州': { factor: 1.05, level: '二线城市' },
                '南通': { factor: 1.05, level: '二线城市' },
                '扬州': { factor: 1.05, level: '二线城市' },
                '徐州': { factor: 1.05, level: '二线城市' },
                '合肥': { factor: 1.0, level: '二线城市' },
                '福州': { factor: 1.0, level: '二线城市' },
                '厦门': { factor: 0.95, level: '新一线城市' },
                '泉州': { factor: 1.05, level: '二线城市' },
                '青岛': { factor: 0.95, level: '新一线城市' },
                '济南': { factor: 1.0, level: '二线城市' },
                '烟台': { factor: 1.05, level: '二线城市' },
                '潍坊': { factor: 1.05, level: '二线城市' }
            },
            '华南地区': {
                '广州': { factor: 0.85, level: '一线城市' },
                '深圳': { factor: 0.8, level: '一线城市' },
                '珠海': { factor: 1.0, level: '二线城市' },
                '佛山': { factor: 1.0, level: '二线城市' },
                '东莞': { factor: 1.0, level: '二线城市' },
                '中山': { factor: 1.05, level: '二线城市' },
                '惠州': { factor: 1.05, level: '二线城市' },
                '南宁': { factor: 1.0, level: '二线城市' },
                '海口': { factor: 1.0, level: '二线城市' }
            },
            '华中地区': {
                '武汉': { factor: 1.0, level: '新一线城市' },
                '长沙': { factor: 1.0, level: '新一线城市' },
                '郑州': { factor: 1.0, level: '新一线城市' },
                '南昌': { factor: 1.0, level: '二线城市' },
                '洛阳': { factor: 1.05, level: '二线城市' },
                '襄阳': { factor: 1.05, level: '二线城市' },
                '宜昌': { factor: 1.05, level: '二线城市' }
            },
            '西南地区': {
                '成都': { factor: 1.0, level: '新一线城市' },
                '重庆': { factor: 1.0, level: '新一线城市' },
                '昆明': { factor: 1.0, level: '二线城市' },
                '贵阳': { factor: 1.0, level: '二线城市' },
                '拉萨': { factor: 1.1, level: '三线城市' }
            },
            '西北地区': {
                '西安': { factor: 1.1, level: '二线城市' },
                '兰州': { factor: 1.1, level: '二线城市' },
                '西宁': { factor: 1.1, level: '三线城市' },
                '银川': { factor: 1.1, level: '三线城市' },
                '乌鲁木齐': { factor: 1.1, level: '二线城市' }
            },
            '东北地区': {
                '沈阳': { factor: 1.0, level: '二线城市' },
                '大连': { factor: 1.0, level: '二线城市' },
                '长春': { factor: 1.0, level: '二线城市' },
                '哈尔滨': { factor: 1.0, level: '二线城市' }
            }
        };
        
        // 城市性价比系数（城市越小，系数越高，性价比越高）
        this.cityFactors = this.buildCityFactors();
        
        // 学历性价比系数（学历越高，系数越低，性价比越低）
        this.educationFactors = {
            '专科': 1.2,    // 专科生，同等收入下性价比最高
            '本科': 1.0,    // 本科生，基准值
            '硕士': 0.8,    // 硕士生，同等收入下性价比较低
            '博士': 0.6     // 博士生，同等收入下性价比最低
        };
        
        // 学校等级性价比系数（学校越好，系数越低，性价比越低）
        this.schoolRankFactors = {
            '普通院校': 1.1,    // 普通院校，同等收入下性价比较高
            '211院校': 1.0,     // 211院校，基准值
            '985院校': 0.9,     // 985院校，同等收入下性价比较低
            '顶尖院校': 0.8     // 顶尖院校，同等收入下性价比最低
        };
    }
    
    /**
     * 构建城市系数映射
     * @returns {Object} 城市系数映射
     */
    buildCityFactors() {
        const factors = {};
        Object.values(this.cityData).forEach(region => {
            Object.entries(region).forEach(([city, data]) => {
                factors[city] = data.factor;
            });
        });
        // 添加默认值
        factors['其他'] = 1.2;
        return factors;
    }
    
    /**
     * 获取所有地区
     * @returns {Array} 地区列表
     */
    getRegions() {
        return Object.keys(this.cityData);
    }
    
    /**
     * 获取指定地区的城市
     * @param {string} region - 地区名称
     * @returns {Array} 城市列表
     */
    getCitiesByRegion(region) {
        if (this.cityData[region]) {
            return Object.keys(this.cityData[region]);
        }
        return [];
    }
    
    /**
     * 获取城市信息
     * @param {string} city - 城市名称
     * @returns {Object} 城市信息
     */
    getCityInfo(city) {
        for (const region of Object.values(this.cityData)) {
            if (region[city]) {
                return region[city];
            }
        }
        return { factor: 1.0, level: '其他城市' };
    }
    
    /**
     * 计算收入指数
     * @param {Object} data - 收入相关数据
     * @returns {Object} 收入指数计算结果
     */
    calculateIncomeIndex(data) {
        const {
            salary,           // 税前工资
            afterTax,         // 税后工资
            allowance,        // 月度补贴
            insuranceBase,    // 五险一金基数
            fundRate,         // 公积金比例
            otherBenefits,    // 其他福利
            city,             // 工作城市
            education,        // 学历
            schoolRank        // 学校等级
        } = data;
        
        // 获取系数
        const cityFactor = this.cityFactors[city] || 1.0;
        const educationFactor = this.educationFactors[education] || 1.0;
        const schoolRankFactor = this.schoolRankFactors[schoolRank] || 1.0;
        
        // 计算五险一金
        const socialInsurance = this.calculateSocialInsurance(insuranceBase);
        
        // 计算公积金
        const housingFund = this.calculateHousingFund(insuranceBase, fundRate);
        
        // 计算总收入
        const totalIncome = afterTax + housingFund + otherBenefits;
        
        // 计算收入指数（基准值5000元）
        const baseIncome = 5000;
        let incomeIndex = (totalIncome / baseIncome) * 100;
        
        // 应用城市、学历、学校等级系数（系数越高，性价比越高）
        incomeIndex = incomeIndex * cityFactor * educationFactor * schoolRankFactor;
        
        return {
            incomeIndex: Math.round(incomeIndex * 100) / 100,
            totalIncome: Math.round(totalIncome * 100) / 100,
            socialInsurance: Math.round(socialInsurance * 100) / 100,
            housingFund: Math.round(housingFund * 100) / 100,
            cityFactor,
            educationFactor,
            schoolRankFactor,
            cityInfo: this.getCityInfo(city),
            breakdown: {
                afterTax,
                housingFund,
                otherBenefits,
                allowance
            }
        };
    }
    
    /**
     * 计算五险一金
     * @param {number} base - 基数
     * @returns {number} 五险一金总额
     */
    calculateSocialInsurance(base) {
        // 养老保险(个人8%+公司16%) + 医疗保险(个人2%+公司8%) + 失业保险(个人0.5%+公司0.5%) + 工伤保险(公司0.5%) + 生育保险(公司0.5%)
        const personalRate = 0.08 + 0.02 + 0.005; // 个人缴纳比例
        const companyRate = 0.16 + 0.08 + 0.005 + 0.005 + 0.005; // 公司缴纳比例
        
        return base * (personalRate + companyRate);
    }
    
    /**
     * 计算公积金
     * @param {number} base - 基数
     * @param {number} rate - 比例
     * @returns {number} 公积金总额
     */
    calculateHousingFund(base, rate) {
        // 公积金双边缴纳
        return base * rate * 0.02;
    }
    
    /**
     * 获取收入指数权重
     * @returns {number} 权重值
     */
    getWeight() {
        return 0.60; // 收入指数占总分的60%
    }
}
