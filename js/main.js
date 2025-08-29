/**
 * 工作性价比计算器主模块
 * 整合所有计算器，实现主要计算逻辑
 */
import { IncomeCalculator } from './calculators/incomeCalculator.js';
import { WorkCalculator } from './calculators/workCalculator.js';
import { CostCalculator } from './calculators/costCalculator.js';
import { ExperienceCalculator } from './calculators/experienceCalculator.js';

export class WorkValueCalculator {
    constructor() {
        this.incomeCalculator = new IncomeCalculator();
        this.workCalculator = new WorkCalculator();
        this.costCalculator = new CostCalculator();
        this.experienceCalculator = new ExperienceCalculator();
        
        // 初始化计算器
        this.init();
    }
    
    /**
     * 初始化计算器
     */
    init() {
        this.bindEvents();
        this.initCitySelector();
    }
    
    /**
     * 初始化城市选择器
     */
    initCitySelector() {
        const regionSelect = document.getElementById('region');
        const citySelect = document.getElementById('city');
        
        if (regionSelect && citySelect) {
            // 填充地区选项
            const regions = this.incomeCalculator.getRegions();
            regionSelect.innerHTML = '<option value="">请选择地区</option>';
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionSelect.appendChild(option);
            });
            
            // 地区变化时更新城市选项
            regionSelect.addEventListener('change', (e) => {
                const selectedRegion = e.target.value;
                citySelect.innerHTML = '<option value="">请选择城市</option>';
                
                if (selectedRegion) {
                    const cities = this.incomeCalculator.getCitiesByRegion(selectedRegion);
                    cities.forEach(city => {
                        const option = document.createElement('option');
                        option.value = city;
                        option.textContent = city;
                        citySelect.appendChild(option);
                    });
                }
            });
        }
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 计算按钮事件
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateValue());
        }
        
        // 重置按钮事件
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetForm());
        }
        
        // 显示计算逻辑按钮事件
        const showLogicBtn = document.getElementById('showLogicBtn');
        if (showLogicBtn) {
            showLogicBtn.addEventListener('click', () => this.showCalculationLogic());
        }
    }
    
    /**
     * 计算工作性价比
     */
    calculateValue() {
        try {
            // 收集表单数据
            const formData = this.collectFormData();
            
            // 验证数据
            if (!this.validateFormData(formData)) {
                return;
            }
            
            // 计算各项指数
            const incomeResult = this.incomeCalculator.calculateIncomeIndex(formData);
            const workResult = this.workCalculator.calculateWorkIndex(formData);
            const costResult = this.costCalculator.calculateCostIndex(formData);
            const experienceResult = this.experienceCalculator.calculateExperienceIndex(formData);
            
            // 计算综合得分
            const totalScore = this.calculateTotalScore({
                income: incomeResult.incomeIndex,
                work: workResult.workIndex,
                cost: costResult.costIndex,
                experience: experienceResult.experienceIndex
            });
            
            // 获取评价和建议
            const evaluation = this.getEvaluation(totalScore.totalScore);
            
            // 显示结果
            this.displayResult({
                totalScore,
                evaluation,
                incomeResult,
                workResult,
                costResult,
                experienceResult,
                formData
            });
            
        } catch (error) {
            console.error('计算过程中出现错误:', error);
            alert('计算过程中出现错误，请检查输入数据！');
        }
    }
    
    /**
     * 收集表单数据
     * @returns {Object} 表单数据
     */
    collectFormData() {
        const formData = {};
        
        // 基本信息
        formData.name = document.getElementById('name')?.value || '匿名用户';
        formData.region = document.getElementById('region')?.value || '';
        formData.city = document.getElementById('city')?.value || '其他';
        formData.age = parseFloat(document.getElementById('age')?.value) || 25;
        formData.education = document.getElementById('education')?.value || '本科';
        formData.schoolRank = document.getElementById('schoolRank')?.value || '普通院校';
        
        // 收入信息
        formData.salary = parseFloat(document.getElementById('salary')?.value) || 0;
        formData.afterTax = parseFloat(document.getElementById('afterTax')?.value) || 0;
        formData.allowance = parseFloat(document.getElementById('allowance')?.value) || 0;
        formData.insuranceBase = parseFloat(document.getElementById('insuranceBase')?.value) || 0;
        formData.fundRate = parseFloat(document.getElementById('fundRate')?.value) || 0.12;
        formData.otherBenefits = parseFloat(document.getElementById('otherBenefits')?.value) || 0;
        
        // 工作信息
        formData.workStart = parseFloat(document.getElementById('workStart')?.value) || 9;
        formData.workEnd = parseFloat(document.getElementById('workEnd')?.value) || 18;
        formData.commuteTime = parseFloat(document.getElementById('commuteTime')?.value) || 60;
        formData.overtimeFreq = parseFloat(document.getElementById('overtimeFreq')?.value) || 0;
        formData.overtimeHours = parseFloat(document.getElementById('overtimeHours')?.value) || 0;
        formData.workIntensity = parseFloat(document.getElementById('workIntensity')?.value) || 3;
        formData.workDays = parseFloat(document.getElementById('workDays')?.value) || 5;
        
        // 成本信息
        formData.rent = parseFloat(document.getElementById('rent')?.value) || 0;
        formData.food = parseFloat(document.getElementById('food')?.value) || 0;
        formData.transport = parseFloat(document.getElementById('transport')?.value) || 0;
        
        // 体验信息
        formData.housingSatisfaction = parseFloat(document.getElementById('housingSatisfaction')?.value) || 5;
        formData.consumptionSatisfaction = parseFloat(document.getElementById('consumptionSatisfaction')?.value) || 5;
        formData.transportSatisfaction = parseFloat(document.getElementById('transportSatisfaction')?.value) || 5;
        formData.lifeAtmosphere = parseFloat(document.getElementById('lifeAtmosphere')?.value) || 5;
        formData.workAtmosphere = parseFloat(document.getElementById('workAtmosphere')?.value) || 5;
        
        return formData;
    }
    
    /**
     * 验证表单数据
     * @param {Object} formData - 表单数据
     * @returns {boolean} 验证结果
     */
    validateFormData(formData) {
        if (!formData.afterTax || formData.afterTax <= 0) {
            alert('请输入有效的税后工资！');
            return false;
        }
        
        if (formData.workEnd <= formData.workStart) {
            alert('下班时间必须晚于上班时间！');
            return false;
        }
        
        if (!formData.city) {
            alert('请选择工作城市！');
            return false;
        }
        
        return true;
    }
    
    /**
     * 计算总分
     * @param {Object} scores - 各项指标得分
     * @returns {Object} 总分和评价结果
     */
    calculateTotalScore(scores) {
        // 权重分配：收入指数60%，工作指数25%，成本指数10%，体验指数5%
        const weights = {
            income: 0.60,    // 收入指数权重60%
            work: 0.25,      // 工作指数权重25%
            cost: 0.10,      // 成本指数权重10%
            experience: 0.05 // 体验指数权重5%
        };
        
        // 计算加权总分
        let totalScore = 0;
        
        // 收入指数（越高越好）
        totalScore += scores.income * weights.income;
        
        // 工作指数（越低越好，所以用100减去）
        totalScore += (100 - scores.work) * weights.work;
        
        // 成本指数（越低越好，所以用100减去）
        totalScore += (100 - scores.cost) * weights.cost;
        
        // 体验指数（越高越好）
        totalScore += scores.experience * weights.experience;
        
        // 确保总分在0-100范围内
        totalScore = Math.max(0, Math.min(100, totalScore));
        
        return {
            totalScore: Math.round(totalScore * 100) / 100,
            weights: weights,
            breakdown: {
                income: scores.income * weights.income,
                work: (100 - scores.work) * weights.work,
                cost: (100 - scores.cost) * weights.cost,
                experience: scores.experience * weights.experience
            }
        };
    }
    
    /**
     * 获取评价和建议
     * @param {number} score - 得分
     * @returns {Object} 评价和建议
     */
    getEvaluation(score) {
        if (score >= 95) {
            return {
                grade: '天菜！',
                comment: '太棒了，你的公司在哪？我也要入职！',
                emoji: '🌟',
                recommendation: '这份工作性价比极高，建议立即接受！'
            };
        } else if (score >= 85) {
            return {
                grade: '优秀！',
                comment: '这工作性价比简直逆天，赶紧珍惜吧！',
                emoji: '✨',
                recommendation: '工作性价比很高，值得长期发展！'
            };
        } else if (score >= 75) {
            return {
                grade: '良好！',
                comment: '这份工作相当不错，值得考虑！',
                emoji: '👍',
                recommendation: '性价比不错，可以考虑接受这份工作！'
            };
        } else if (score >= 65) {
            return {
                grade: '一般！',
                comment: '还可以接受，但还有提升空间。',
                emoji: '😐',
                recommendation: '性价比一般，建议再看看其他机会！'
            };
        } else if (score >= 50) {
            return {
                grade: '及格！',
                comment: '勉强可以接受，但需要慎重考虑。',
                emoji: '😕',
                recommendation: '性价比偏低，除非特别需要这份工作，否则建议继续寻找！'
            };
        } else {
            return {
                grade: '不及格！',
                comment: '这份工作性价比太低，不建议接受这份工作，继续寻找更好的机会吧！',
                emoji: '❌',
                recommendation: '性价比太低，不建议接受这份工作，继续寻找更好的机会吧！'
            };
        }
    }
    
    /**
     * 显示计算结果
     * @param {Object} result - 计算结果
     */
    displayResult(result) {
        // 更新结果页面
        this.updateResultPage(result);
        
        // 显示结果弹窗
        this.showResultModal(result);
    }
    
    /**
     * 更新结果页面
     * @param {Object} result - 计算结果
     */
    updateResultPage(result) {
        // 这里可以更新页面上的结果显示
        console.log('计算结果:', result);
    }
    
    /**
     * 显示结果弹窗
     * @param {Object} result - 计算结果
     */
    showResultModal(result) {
        // 这里可以实现结果弹窗显示逻辑
        console.log('显示结果弹窗:', result);
    }
    
    /**
     * 重置表单
     */
    resetForm() {
        const form = document.getElementById('calculatorForm');
        if (form) {
            form.reset();
        }
        
        // 重置所有输入字段为默认值
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'number') {
                input.value = input.defaultValue || '';
            } else if (input.type === 'select-one') {
                input.selectedIndex = 0;
            }
        });
        
        // 重新初始化城市选择器
        this.initCitySelector();
    }
    
    /**
     * 显示计算逻辑
     */
    showCalculationLogic() {
        // 跳转到计算逻辑页面
        window.location.href = 'calculation-logic.html';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new WorkValueCalculator();
});
