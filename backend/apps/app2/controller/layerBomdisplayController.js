const Service = require('../service/layerBomdisplayservice')
const product_regService = require('../service/productRegservice');
const m_matService = require('../service/m_matservice');
const { leftJoin } = require('../utility/leftJoin') 
const {createColumnDefs} = require('../utility/getColumn')
const dbconnect = require('../../../middleWare/Dbconnect');
//mat
const layerDisplaycontroller = async (req, res) => {
    // [
    //     production_code = '',

    // ]
    try {

        const resultfgerp = (await m_matService.getAllmat()).filter(item => 
            item.component?.toLowerCase().includes('fg')
        );
        // console.log('resultfgerp', resultfgerp)
        const resultProductcode = await product_regService.getAllprodutReg()
        let resultlayer0 = []

        for (const item of resultProductcode) {
            const production_code = item.production_code;
            const layer0Data = await Service.getAlllayer0(production_code);
            resultlayer0.push(layer0Data)
        }

        const resultBomtree = []
        const resultBomtreeHP = []

        const resultBomtreeHPweight = await Service.getAllhpheightestWeight();

        for (const item of resultfgerp) {
            const fg_erp = item.erp;
            const bomtree = await Service.getAllbomtree(fg_erp);
            resultBomtree.push(bomtree)
            const bomtreeHP = await Service.getAllbomtreeHp(fg_erp);
            resultBomtreeHP.push(bomtreeHP)
            // const bomtreeWeight = await Service.getAllhpheightestWeight(fg_erp);
            // resultBomtreeHPweight.push(bomtreeWeight)
        }
        // console.log("resultBomtree", resultBomtree)

        // console.log('resultfgerp', resultfgerp)

        // console.log('resultProductcode', resultProductcode)
        // console.log('resultBomtreeHPweight', resultBomtreeHPweight)
        // console.log('resultBomtreeHP', resultBomtreeHP)
        // console.log('resultBomtree', resultBomtree)
        // console.log('resultlayer0', resultlayer0)
        //bom tree left join product code
        const bomtreejoin = leftJoin((resultBomtree.flat()), resultProductcode, 'semi_fg', 'fg_erp');
        // const bomtreejoin = leftJoin(resultProductcode, (resultBomtree.flat()), 'fg_erp', 'semi_fg');
        // console.log("resultBomtree", resultBomtree)
        // console.log('bomtreejoin', bomtreejoin)
        // const bomtreejoin = leftJoin(resultProductcode, resultBomtree, 'fg_erp', 'semi_fg');
        // console.log('bomtreejoin', bomtreejoin)
        let result =[]
        console.log('bomtreejoin', bomtreejoin)
        const bomtreemapdata = bomtreejoin.map(item => ({
            production_code: item.production_code || null,
            erp_code: item.fg_erp || null,
            parent: item.parent || null,
            child: item.child || null,
            child_name: item.child_name || null,
            level: item.level || null,
            quantity: item.quantity || null,
            total_qty: item.total_qty || null,
            priority: item.priority || null,
        }));
        // console.log("bomtreemapdata", bomtreemapdata)
        // console.log("resultlayer0.flat()", resultlayer0.flat())
        const mapResultlayer0 = (resultlayer0.flat()).map(item => ({
            production_code: item.production_code || null,
            erp_code: item.fg_erp || null,
            parent: item.fg_erp || null,
            child: item.child || null,
            child_name: item.child_name || null,
            level: Number(0),
            quantity: item.quantity || null,
            total_qty: item.quantity || null,
            priority: 1|| null,
        }))
        // console.log("mapResultlayer0", mapResultlayer0)

        // const resultBomtreeHPjoinweight = leftJoin((resultBomtreeHP.flat()), resultBomtreeHPweight, 'child', 'parrent');
        const resultBomtreeHPjoinweight = resultBomtreeHP.flat().flatMap(hpItem => {
            // Find ALL matching weights
            const matchingWeights = resultBomtreeHPweight.filter(w => w.parrent === hpItem.child);
            
            // Create a new object for every matched weight
            return matchingWeights.map(weight => ({
              ...hpItem,
              ...weight // Spreading this second overwrites 'quantity' with the weight's quantity
            }));
        });
          
        //   console.log(resultBomtreeHPjoinweight);
        const resultBomtreeHPjoinproduct = leftJoin(resultBomtreeHPjoinweight, resultProductcode, 'semi_fg', 'fg_erp');

        // console.log('(resultBomtreeHP.flat()', resultBomtreeHP.flat())
        // console.log('resultBomtreeHPweight', resultBomtreeHPweight)
        // console.log('resultBomtreeHPjoinweight', resultBomtreeHPjoinweight)
        // console.log('resultBomtreeHPjoinproduct', resultBomtreeHPjoinproduct)
        const mapBomtreeHPjoinweight = resultBomtreeHPjoinproduct.map(item => ({
            production_code: item.production_code || null,
            erp_code: item.semi_fg || null,
            parent: item.parrent || null,
            child: item.mat_id || null,
            child_name: item.mat_name || null,
            level: (Number(item.level) + 2) || null,
            quantity: item.quantity || null,
            total_qty: item.total_qty * item.quantity || null,
            priority: item.priority || null,
        }));
        // result = [ ...mapResultlayer0]
        result = [...bomtreemapdata, ...mapResultlayer0, ...mapBomtreeHPjoinweight].map(i=>({
            production_code: i.production_code,
            ...i,
            priority: Number(i.priority)
        }))
        // console.log("bomtreemapdata", bomtreemapdata)
        // console.log("resultlayer0", resultlayer0)
        // console.log("mapBomtreeHPjoinweight", mapBomtreeHPjoinweight)
        
        const sortedData = result.sort((a, b) => {
            // 1. Sort by production_code (Z-A / Descending)
            const codeA = String(a.production_code || "");
            const codeB = String(b.production_code || "");
            const codeCompare = codeB.localeCompare(codeA);
            
            // If production codes are different, return the result of the Z-A comparison
            if (codeCompare !== 0) {
                return codeCompare;
            }
        
            // 2. Sort by level (Ascending / 0, 1, 2, 3...)
            // We treat `null` as `Infinity` so it appears after the numbered levels
            const levelA = a.level !== null ? Number(a.level) : Infinity;
            const levelB = b.level !== null ? Number(b.level) : Infinity;
        
            return levelA - levelB;
        });
        // console.log(sortedData);
        const columnDefs = createColumnDefs(result);

        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: sortedData,
            columnDefs:columnDefs
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
        error: error.message
        });
    }
};



module.exports = {
    layerDisplaycontroller,

};

