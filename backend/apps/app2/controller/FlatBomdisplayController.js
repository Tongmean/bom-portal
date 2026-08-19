const layerService = require('../service/layerBomdisplayservice')
const flatService = require('../service/FlatBomdisplayservice')
const product_regService = require('../service/productRegservice');
const m_matService = require('../service/m_matservice');
const { leftJoin } = require('../utility/leftJoin') 
const {createColumnDefs} = require('../utility/getColumn')
const dbconnect = require('../../../middleWare/Dbconnect');
const { pivotERPData } = require('../utility/pivotUltility');
//mat
const flatDisplaycontroller = async (req, res) => {
    // const payload = 
    //     {
    //       erp: [ { fg_erp: "CSKL-IZ009-A130-EDS-S(S)" }, { fg_erp: "3" } ],
    //       production: [ { production_code: "CSKL-IZ009-A130-EDS-S(S)" },{ production_code: "3" }  ]
    //     }
    const payload = req.body;

    try {
        const resultBomtreehpWeight = await layerService.getAllhpheightestWeight();
        let product = []
        let resultLayer0 = [];
        for (const i of payload.production){
            const res = await flatService.getAlllayer0(i.production_code);
            resultLayer0.push(...res.flat()); // Spread the flattened array items
            const resProduct = await flatService.getAllproductandspec(i.production_code);
            product.push(...resProduct.flat());
        }

        let resultBomtree = [];
        let resultBomtreehp = [];
        for (const i of payload.erp){
            const resBom = await flatService.getAllbomtree(i.fg_erp);
            const resBomHp = await flatService.getAllbomtreeHp(i.fg_erp);
            
            resultBomtree.push(...resBom.flat());
            resultBomtreehp.push(...resBomHp.flat());
        }
        // console.log("resultBomtreehpWeight", resultBomtreehpWeight)
        // console.log("resultBomtreehp", resultBomtreehp)
        // console.log("product", product)
        // console.log("resultBomtree", resultBomtree)
        // console.log("resultLayer0", resultLayer0)
        const joinHpweight = resultBomtreehp.flatMap(hpItem => {
            // Find ALL matching weights
            const matchingWeights = resultBomtreehpWeight.filter(w => w.erp === hpItem.parrent);
            
            // Create a new object for every matched weight
            return matchingWeights.map(weight => ({
              ...hpItem,
              ...weight // Spreading this second overwrites 'quantity' with the weight's quantity
            }));
        });
        // console.log("joinHpweight", joinHpweight)
        const hpWeightmapped = joinHpweight.map(i =>({
            fg_code: i.fg_erp,
            erp: i.mat_id,
            name: i.name,
            component: i.component,
            quantity: i.quantity * i.total_quantity

        }))
        // console.log("hpWeightmapped", hpWeightmapped)
        // const pivotHpWeightmapped = pivotERPData(hpWeightmapped, ['fg_code'])
        const pivotHpWeightmapped = Object.values(hpWeightmapped.reduce((acc, curr) => {
            // Initialize the row if it doesn't exist
            if (!acc[curr.fg_code]) {
              acc[curr.fg_code] = { fg_code: curr.fg_code };
            }
            
            const row = acc[curr.fg_code];
            let index = 1;
            
            // Find the next available index to prevent overwriting
            while (row[`${curr.component}_${index}_erp`]) {
              index++;
            }
          
            // Assign values with the new indexed keys
            row[`${curr.component}_${index}_erp`] = curr.erp;
            row[`${curr.component}_${index}_name`] = curr.name;
            row[`${curr.component}_${index}_quantity`] = curr.quantity;
          
            return acc;
          }, {}));
        // console.log("pivotHpWeightmapped",pivotHpWeightmapped )
        // const columnDefs = createColumnDefs(result);
        //final join
        const productjoinbomtree =leftJoin(product, resultBomtree, 'fg_erp', 'fg_erp');
        const productjoinbomtreejoinhp =leftJoin(productjoinbomtree, resultBomtreehp, 'fg_erp', 'fg_code');

        const finaljoin = leftJoin(
            productjoinbomtreejoinhp,
            resultLayer0,
            'production_code',
            'production_code'
        ).map(item => {
            const {
                fg_code,
                ...rest
            } = item;
        
            return rest;
        });

        console.log("finaljoin", finaljoin)
        const columnDefs = createColumnDefs(finaljoin);
        console.log("columnDefs", columnDefs)
        
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: finaljoin,
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
    flatDisplaycontroller,

};
