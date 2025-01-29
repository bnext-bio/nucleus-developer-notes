# IV-HSL emitter cell protocol

## Overview

This protocol reconstitutes the BjaI/BjaR quorum sensing components from *Bradyrhizobium japonicum* to establish IV-HSL-producing synthetic cells (emitters) and IV-HSL-responsive *Escherichia coli* cells (receivers), implementing the [IV-HSL Emitter Cell](https://www.notion.so/IV-HSL-Emitter-Cell-13eae616eb5180a9a1bed10a8a96a0e6?pvs=21).

BjaI is expressed inside Emitter Cells containing PURExpress to produce the enzyme BjaI from the template `pT7-bjaI`. BjaI will catalyze a reaction between the membrane impermeable IV-CoA and SAM substrates to yield membrane *permeable* IV-HSL.

*E. coli* cells expressing BjaR act as receiver cells, providing an easy means to detect IV-HSL production. When BjaR binds IV-HSL, expression of a fluorescent reporter gene controlled by a BjaR-regulated promoter is triggered. 

Successfully built IV-HSL Emitter Cells will release IV-HSL and induce GFP expression in XL10-Gold cell with increasing green fluorescence over time.

There are five key stages to making the IV-HSL Emitter Cell:

| Step | Process | Hands-on Time | Total Time | Notes |
| --- | --- | --- | --- | --- |
| 1 | [**Pre-culture BjaR receiver cells**](https://www.notion.so/Private-Protocol-IV-HSL-Emitter-Cell-137ae616eb518050894ec3637c0aad2c?pvs=21) | 30 mins | 3.5 hr |  |
| 2 | [**Prepare lipids-in-oil solution, outer solution, and substrate stock solutions**](https://www.notion.so/Private-Protocol-IV-HSL-Emitter-Cell-137ae616eb518050894ec3637c0aad2c?pvs=21) | 1 hr | 4 h | Buffers and lipids may be prepared in advance and used for experiments on subsequent days. |
| 3 | [**Assemble PURE reactions**](https://www.notion.so/Private-Protocol-IV-HSL-Emitter-Cell-137ae616eb518050894ec3637c0aad2c?pvs=21) | 30 mins | 30 mins |  |
| 4 | [**Encapsulate liposomes**](https://www.notion.so/Private-Protocol-IV-HSL-Emitter-Cell-137ae616eb518050894ec3637c0aad2c?pvs=21) | 30 mins | 30 mins |  |
| 5 | [**Measure and image**](https://www.notion.so/Private-Protocol-IV-HSL-Emitter-Cell-137ae616eb518050894ec3637c0aad2c?pvs=21) | 30 mins  | 6–12 h | Total time depends on the exact experiment and incubation conditions. GFP expression should be seen over the first 6 hours at 37C.
 |

## Materials and equipment

| **Name** | **Product** | **Manufacturer** | **Part #** | **Price** | **Link** |
| --- | --- | --- | --- | --- | --- |
| ***Buffers*** |  |  |  |  |  |
| **Glucose** | D-(+)-Glucose, 99% | Thermo Scientific | A16828-36 | **$**41.65 | [[link](https://www.thermofisher.com/order/catalog/product/A16828.36)] |
| **Sucrose** | Sucrose, 99% | Thermo Scientific | A15583-36 | $41.65 | [[link](https://www.thermofisher.com/order/catalog/product/A15583.36?SID=srch-srp-A15583.36)] |
|  |  |  |  |  |  |
| ***Lipids*** |  |  |  |  |  |
| **Egg PC** | 25mg/mL | Avanti Lipids | 840051C-200mg | $186 | [[link](https://avantiresearch.com/product/840051?utm_source=uptick&utm_medium=paid&utm_campaign=pmax_general&gad_source=1&gclid=Cj0KCQiAlsy5BhDeARIsABRc6ZsUZq4wPlH7DXElWO66j8-rEy3Ueu6EMuX5EBx0kwZpI-SWZVEDL7EaAnDYEALw_wcB)] |
| **Liss-Rhod-PE** | 18:0 Liss Rhod PE 1 mg/mL | Avanti Lipids | 810179P-1mg | $273.47 | [[link](https://avantilipids.com/product/810179)] |
| **Mineral Oil** | Mineral oil, mixed weight | Thermo Scientific | AC415080010 | $53.40 | [[link](https://www.sigmaaldrich.com/US/en/product/sigald/496189)] |
| **Glass Syringe 250 uL** |  | Hamilton | 14-815-238 | $150.15 | [[link](https://www.fishersci.com/shop/products/800-microliter-syringes-rn-termination/14815238)] |
|  |  |  |  |  |  |
| ***PURE*** |  |  |  |  |  |
| **PURE** | PURExpress | NEB | E6800S | $295.00 | [[link](https://www.neb.com/en-us/products/e6800-purexpress-invitro-protein-synthesis-kit)] |
| **RNase Inhibitor** | RNase Inhibitor, Murine | NEB | M0314S | $81.00 | [[link](https://www.neb.com/en-us/products/m0314-rnase-inhibitor-murine)] |
| **DNA** | `pT7-bjaI` | b. next |  |  | [[link](https://www.notion.so/Nucleus-v0-2-0-Distribution-Plate-144ae616eb518037818ae9bda70884d9?pvs=21)] |
|  | `bjaR-GFP-native` | b.next |  |  | [[link](https://www.notion.so/Nucleus-v0-2-0-Distribution-Plate-144ae616eb518037818ae9bda70884d9?pvs=21)] |
| **OptiPrep** | OptiPrep - Density Gradient Media (Iodixanol) | COSMO BIO USA | AXS-1114542 | $172 | [[link](https://www.cosmobiousa.com/products/optiprep-density-gradient-media-iodixanol)] |
| **SAM** | S-adenosylmethionine (SAM) | NEB | B9003S | $45 | [[link](https://www.neb.com/en-us/products/b9003-s-adenosylmethionine-sam?srsltid=AfmBOoqDUA87yhYE4UrHnh7q8qMgLw8BGgGfFflrpBxYBfuL5juVceYZ)] |
| **IV-CoA** | Isovaleryl coenzyme A lithium salt hydrate | Millipore Sigma | I9381-10MG | $348 | [[link](https://www.sigmaaldrich.com/US/en/product/sigma/i9381)] |
| **IV-HSL** | 3-Methyl-N-[(3S)-tetrahydro-2-oxo-3-furanyl]butanamide | LGC | TRC-M282980-50MG | $171 | [[link](https://www.lgcstandards.com/US/en/p/TRC-M282980)] |
| **DMSO** | Dimethyl sulfoxide | Thermo Scientific | 042780.M1 | $342 | [[link](https://www.thermofisher.com/order/catalog/product/042780.M1?SID=srch-srp-042780.M1)] |
|  |  |  |  |  |  |
| ***Cell culture*** |  |  |  |  |  |
| **XL10-Gold Cells** | XL10-Gold Ultracompetent Cells | Agilent | 200314 | $223 | [[link](https://www.agilent.com/en/product/mutagenesis-cloning/competent-cells-competent-cell-supplies/competent-cells-for-difficult-cloning/xl10-gold-ultracompetent-cells-233087)] |
| **M9 Media** | M9, Minimal Salts, 5X, powder, minimal microbial growth medium | Sigma-Aldrich | M6030-1KG | $260 | [[link](https://www.sigmaaldrich.com/US/en/product/sigma/m6030)] |

## Experimental protocol

### Step 1: Pre-culture BjaR receiver cells 

- [ ]  Prepare glycerol stock of BjaR receiver cells
    - [ ]  Transform XL-10 Gold competent *E. coli* with `bjaR-GFP-native`:
        - [ ]  Add 1–5 µl containing 1 pg–100 ng of plasmid DNA `bjaR-GFP-native` to 50 µl of XL10-Gold cell mixture. Carefully flick the tube 4–5 times to mix cells and DNA. **Do not vortex.**
        - [ ]  Place the mixture on ice for 15 minutes. Do not mix.
        - [ ]  Heat shock at exactly 42°C for 40 seconds. Do not mix.
        - [ ]  Place on ice for 5 minutes. Do not mix.
        - [ ]  Pipette 950 µl of room temperature SOC into the cell mixture.
        - [ ]  Shake the cell mixture vigorously (250 rpm) at 37°C for 60 minutes.
        - [ ]  Warm Ampicilin LB agarose plates at 37°C for 10 mins.
        - [ ]  Mix the cells thoroughly by flicking the tube and inverting, then perform several 10-fold serial dilutions in LB.
        - [ ]  Spread 50–100 µl of each dilution onto a Ampicilin agarose plate and
        incubate overnight for ~15 hrs at 37°C.
    - [ ]  [if we’re including making a glycerol stock, need overnight culture and glycerol stock preparation here]
- [ ]  Prepare a streak plate from the glycerol stock ([reference](https://www.addgene.org/protocols/streak-plate/))
    - [ ]  Streak a Ampicillin LB plate from the glycerol stock and incubate overnight at 37C.
- [ ]  Prepare M9 Media containing 1× M9 salts, 0.34 mg/ml−1 thiamine hydrochloride, 0.2% casamino acids, 2 mM MgSO4, 100 µM CaCl2 and 0.4% (wt/vol) glucose.
- [ ]  Pick a colony from the *E. coli* streak plate, and inoculate a 5 mL culture tube containing the M9 media with 100 ug/mL carbenicillin.
- [ ]  Incubate the cells at 37 °C, 225 rpm, for 3 h. *Prepare Emitter liposomes while the cells incubate.*
- [ ]  Dilute the culture media with the pre-warmed M9 media until OD600 = ~0.1.
- [ ]  Balance osmolarity of the culture media with PURE (inner solution in liposomes) by adding glucose to the M9 media:

|  | Volume to mix (uL) |
| --- | --- |
| **M9 media** | 1000 |
| **3M Glucose** | 293.81 |

### Step 2: Prepare lipids-in-oil solution, outer solution, and substrate stock solutions

**Prepare lipids-in-oil (mineral oil) solution** 

- [ ]  Clean glass syringes.
    - [ ]  Pour a small amount of 95% ethanol into a glass container ****(e.g. a 10 mL beaker).
    - [ ]  Assemble the glass syringe and prime it by drawing ethanol into the glass syringe, then empty into a waste bottle.
- [ ]  Use glass syringes to add lipids, as shown in the table below, into the 10 ml glass vial containing 1 ml of mineral oil (final lipid concentration is 5 mg/ml).

| Lipids | Stock Concentration (mg/mL) | Volume to add (uL) | Target percentage |
| --- | --- | --- | --- |
| **Egg PC** | 25 | 160 | 66.68 |
| **Cholesterol** | 50 | 20 | 33.32 |
| **18:0 Liss Rhod PE** | 1 | 5 | 0.01 |

- [ ]  Heat the lipids-in-oil mixture on a hotplate at 55 C for 3 hrs.
- [ ]  Vortex the lipids-in-oil mixture for 1 min.
- The lipids-in-oil mixture can be stored at 4 C for up to 3 days.

**Prepare outer solution**

Final concentration of sugar stock solution is 900 mM

| Buffer | Volume to add (uL) |
| --- | --- |
| **3M Glucose Stock** | 700 |
| **H2O** | 300 |

**Prepare substrate stock solutions**

| Substrate | Concentration (uM) | MW (g/mol) | Weight (g) | Final Volume (mL) |
| --- | --- | --- | --- | --- |
| **SAM** | 5000 | 398.44 | 1.99 | 1  |
| **IV-CoA** | 5000 | 851.65 | 4.26 | 1  |
| **IV-HSL** | 10 | 183.21 | 1.83 | 1 |

### Step 3: Assemble PURE Reactions

**PURE reaction setup**

|  | Sample | Negative control | Positive control |  |
| --- | --- | --- | --- | --- |
| **Component** | **Volume (uL)** | **Volume (uL)** | **Volume (uL)** | **Notes** |
| PURE Solution A | 12 | 12 | 0 | PURE energy solution: small molecules |
| PURE Solution B | 9 | 9 | 0 | PURE proteins and ribosomes |
| RNAse Inhibitor | 1.5 | 1.5 | 0 | Prevents RNAse activity |
| [EM01-pOpen-pT7-BjaI](https://www.notion.so/EM01-pOpen-pT7-BjaI-548ce27f107c4ff0813822696f4ddc85?pvs=21) (~200 ng/uL) | 1.5 | 0 | 0 | DNA encoding green fluorescent protein |
| SAM (5mM) | 1.8 | 1.8 | 0 | Substrate for IV-HSL production. |
| IV-CoA (5mM) | 0.48 | 0.48 | 0 | Substrate for IV-HSL production. |
| OptiPrep | 1.5 | 1.5 | 1.5 | Adds density for phase-transfer  |
| IV-HSL (10 uM) | 0 | 0 | 0.3 | Commercial IV-HSL for positive control. |
| 3M Glucose | 0 | 0 | 8.46 |  |
| ddH2O | 2.22 | 3.72 | 19.74 |  |
| **Total** | 30 | 30 | 30 |  |
- [ ]  Thaw reagents on ice and then keep on ice.
- [ ]  Prepare a PCR strip in a strip holder on ice for assembly of the three reactions (Sample, Negative, Positive).

### Step 4: Encapsulate PURE reactions into Liposomes

*Some tips and tricks can be found in [“Hello, world” PURE Liposomes](https://www.notion.so/Hello-world-PURE-Liposomes-412dfbe9ffd941bfab16b69ec866de27?pvs=21).*

- [ ]  Set up a microfuge tube rack, with three 1.5 mL microfuge tubes per liposome encapsulation:
    - [ ]  Number the tubes per the number of reactions assembled in Step 3.
    - [ ]  For each reaction, label the two tubes:
        - [ ]  **I** — Oil emulsion
        - [ ]  **O** — Outer solution
- [ ]  Add 30 ul of PURE reactions prepared in **Step 3** to tubes labelled **I**.
- [ ]  Add 180 uL of the lipids-in-oil mixture on top of the PURE reactions in tubes labelled **I** and pipette vigorously until the emulsion becomes cloudy.
- [ ]  Add 300 uL of outer solution to each of the tubes labelled **O**.
- [ ]  Add 210 uL of the milky solution carefully on top of the outer solution in the tubes labelled **O.**
- [ ]  Centrifuge at 9000 rpm at 4c for 10 mins.
- [ ]  Remove the top oil and resuspend the pellet in 100 ul of outer solution.
- [ ]  Collect the liposomes.

### Step 5: Measure and Image Liposomes and Cells

**Imaging using confocal microscopy (Operetta CLS):**

While microscopy setups may vary, our performance data was collected using the following configuration.

- [ ]  Add BjaR receiver cells prepared in Step 1 into 384 Well Glass Bottom Microplates.
- [ ]  Add 10 uL of liposomes made in Step 3 on top of the receiver cells in 384 Well Glass Bottom Microplates.
- [ ]  Imaging conditions using Operetta:
    - Temperature: 37 C degree
    - Green fluorescence channel (200 us expsoure 95%) - excitation: 460-490 nm; emission: 500-550 nm.
    - Red fluorescence channel (50 us exposure 95%) - excitation: 530-560 nm; emission: 570-650 nm.
    - Brightfield (20 us 95%)
    - We capture a 6 h time lapse with 10 min intervals.
    - We also acquired z-stack images spanning from 0 µm to 80 µm of the focal plane.

**Measuring usinng plate reader (BioTek Cytation 5):**

- [ ]  Add BjaR receiver cells prepared in Step 1 into 96 Well Glass Bottom Microplates.
- [ ]  Add 10 uL of liposomes made in Step 3 on top of the receiver cells in 96 Well Glass Bottom Microplates.
- [ ]  Procedures:
    - Temperature: 37 C degree
    - Read the fluorescence intensity from the bottom
    - Excitation wavelength: 485 nm ; Emission wavelength: 528 nm
    - We capture a 6 h time lapse with 5 min intervals

## Background protocols

- [ ]  Prepare lipids for use in encapsulation: [Lipid Preparation](https://www.notion.so/Lipid-Preparation-baed10d160fc410a8b1def6154257b54?pvs=21)
- [ ]  Prepare inner and outer buffers: [PURE inner and outer solution](https://www.notion.so/PURE-inner-and-outer-solution-157a348c3f1e44ffb81538c1e953eb9e?pvs=21)

## Resources and References

- Papers
    - Smith, J. M., Hartmann, D. & Booth, M. J. Engineering cellular communication between light-activated synthetic cells and bacteria. Nature Chemical Biology 19, 1138–1146 (2023). [pdf](https://doi.org/10.1038/s41589-023-01374-7)

## Credits

- b.next