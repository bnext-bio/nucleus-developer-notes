---
# Ensure that this title is the same as the one in `myst.yml`
title: "Nucleus Base Cell Testing"
abstract:
 This Developer Note presents the first evaluation of Nucleus Base Cell, a liposome-encapsulated system containing Nucleus Cytosol for protein synthesis. We demonstrate preparation of the lipid mixture, successful assembly of liposomes containing Cytosol, and time-course expression of deGFP inside the liposomes using a pOpen-deGFP DNA template, establishing the activity of Base Cell.
---

# Overview

In a previous DevNote, we introduced [Nucleus Cytosol](https://doi.org/10.63765/fppr8928) and demonstrated its performance relative to the PURExpress system. In this DevNote, we encapsulate Nucleus Cytosol within liposomes to generate a Base Cell that expresses deGFP over time. We present results and brief protocols for these processes; a detailed version of the protocols will be released later through Nucleus Distribution.

# Base Cell Composition

Assembly of the Base Cell requires preparation of three key components: the lipid-oil mixture for the cell membrane, the inner solution for protein synthesis, and the outer solution to maintain external osmolarity and prevent bursting or shrinking of cells. The critical materials required are listed in {ref}`materials`:

:::{table} Critical Materials
:label: materials
:align: center
| Name | Product |Manufacturer |
| --- | --- | --- |
| Glucose | D-(+)-Glucose, 99.5% | Sigma-Aldrich (G8270-1KG) |
| POPC | 16:0-18:1 PC (POPC) | Avanti Research (A80557) |
| Liss-Rhod-PE | 18:1 Liss Rhod PE | Avanti Research (A81150) |
| Cholesterol |	Cholesterol (plant) | Avanti Research (A80100) |
| Mineral Oil |	Mineral oil, pure |	Thermo Scientific (415080010) |
| Glass vials |	1.8 mL glass vials | Fisher Scientific (03-339-22A) | Room temperature |
| Energy Solution |	SMix | b.next |
| PURE Protein Mix | PMix |	b.next |
| *E. coli* Ribosomes |	Ribosomes |	b.next |
| *E. coli* tRNAs |	tRNAs |	b.next |
| Magnesium acetate | Magnesium acetate | Sigma-Aldrich (M5661) |
| DNA template | pOpen-deGFP | b.next |
| RNAse Inhibitor, Murine |	RNAse Inhibitor, Murine | NEB (M0314S) |
| Nuclease-free water |	Nuclease-free water | ThermoFisher Scientific (AM9916) |
| Optical Adhesive Film | MicroAmp Optical Adhesive Film | ThermoFisher Scientific (4311971) |
| 384-well glass bottom plates | 384-well glass bottom plates |	Cellvis (P384-1.5H-N) |
| Optiprep | Optiprep | Serumwerk bernburg (1893) |
| Osmometer | Vapor Pressure Osmometer | Wescor EliTech Vapro 5600 |
:::

## Lipid-Oil Mixture

The membrane of the Base Cell is composed of 1-palmitoyl-2-oleoyl-sn-glycero-3-phosphocholine **(POPC)**, plant cholesterol **(Chol)**, and 1,2-dioleoyl-sn-glycero-3-phosphoethanolamine-N-(lissamine rhodamine B sulfonyl) **(Liss-Rhod PE)**. Liss-Rhod PE serves as a fluorescent label for the cell membrane, enabling imaging and tracking. A brief protocol for preparing the lipid-oil mixture is provided below.

1. Add 1 mL mineral oil in the 1.8 mL small glass vial.

2. Add lipids shown in {ref}`lipid-oil-mix` into the glass vial on top of the mineral oil. The total intended lipid amount is 7.62 µmol.

:::{table} Lipid-Oil Mixture
:label: lipid-oil-mix
:align: center
| Lipid | Target Percentage (%) | Molecular Weight (g/mol) | Stock Concentration (mg/mL) | Volume to add (µL) |
| --- | --- | --- | --- | --- |
| POPC | 70 | 760.76 | 25 | 162.17 |
| Chol | 29.95 | 386.654 | 50 | 17.65 |
| Liss-Rhod PE | 0.05 | 1301.71 | 1 | 4.96 |
:::

3. Vortex the lipid-in-oil mixture for 10 seconds.

4. Place the glass vial in the bead-loaded hot bath at approximately 55 °C for 4 hours, shielding it from light with an aluminum foil cover. Do not use a lid, as the goal is to allow chloroform to evaporate from the lipids.

5. Place the jar (with lid) containing lipid-in-oil solution at RT for 10 mins before using.

## Inner Solution (Nucleus Cytosol)

[Nucleus Cytosol](https://doi.org/10.63765/fppr8928) serves as the inner solution for deGFP protein synthesis. The composition of the 40 µL inner solution is shown in {ref}`inner-solution`. Of this, 30 µL is used for encapsulation, and 10 µL is reserved for the osmolarity check. In addition to the components of Cytosol, Optiprep is included as a density gradient medium to facilitate the inverted emulsion method for generating synthetic cells. The inner solution is prepared on ice or a cold block to prevent protein expression from starting during assembly. This ensures the microscope captures the complete fluorescence kinetics for deGFP expression.

:::{table} Inner Solution Composition
:label: inner-solution
:align: center
| Component | Input concentration | Unit | Final concentration | Unit | Volume for one reaction (µL) |
| --- | --- | --- | --- | --- | --- |
| SMix | 4 | × | 1 |	× |	10 |
| PMix | 15	| mg/mL | 1.80 | mg/mL| 4.8 |
| Ribosomes	| 10 | µM |	1.8 | µM | 7.2 |
| pOpen-deGFP DNA |	124	| nM | 3 |nM | 0.95 |
| tRNA | 35	| mg/ml | 3.5 | mg/ml |	4 |
| Magnesium acetate | 200 |	mM | 8 | mM | 1.6 |
| Optiprep | 1.32 |	mg/µL |	0.043 |	mg/µL |	1.33 |
| Water | | | | | 10.12 |				
| Total volume (µL) | | | | | 40 |
:::

## Outer Solution (Glucose)

A 2 M glucose stock solution was prepared and sterilized using a 0.22 µm filter. Based on the measured osmolarity of the inner solution (1060 mOsm/kg), an 850 mM glucose outer solution was prepared from the 2 M stock to approximate the inner solution’s osmolarity and reduce cell swelling or shrinkage. The osmolarity of the 850 mM glucose solution was measured at 950 mOsm/kg.

# Preparation of Liposomes

Once the lipid–oil mixture, inner solution, and outer solution were ready, liposomes were prepared according to the following protocol:

1. Add 300 µL of outer solution to a 1.5 mL tube (Tube A).

2. Add 150 µL of the lipid–oil mixture on top of 30 µL of inner solution, then washboard or vortex to form an emulsion.

3. Transfer the resulting milky emulsion onto the outer solution in Tube A.

4. Centrifuge at room temperature for 10 min at 9000 × g.

5. Carefully remove the residual oil layer, leaving 100 µL of solution in Tube A.

6. Resuspend the liposome pellet by gentle pipetting and transfer the suspension to a 384-well glass-bottom plate for microscopic imaging.

# Results

## Osmolarity Balance

A critical step in liposome preparation is the careful osmotic balance between the inner and outer solutions. The osmolarity of the inner solution was determined using an osmometer with a 10 μL aliquot, yielding a measured osmolarity of 1060 mOsm/kg. Based on this value, the osmolarity of the outer glucose solution was systematically optimized to be 100–150 mOsm/kg lower than the inner solution, corresponding to an outer solution of 850 mM glucose. This osmotic gradient range was selected to maintain liposome integrity during formation; osmotic gradients outside this range resulted in liposome failure due to either membrane shrinkage (when the outer solution was more hypertonic) or membrane rupture and content leakage (when the outer solution was more hypotonic).

## deGFP expression inside Base Cell

Successful liposome preparations were imaged on a Cephla Squid+ microscope at 37 °C, and time-series data were collected to monitor deGFP expression. Representative images acquired at the start of incubation and after 3 hours are shown in {ref}`Image1` and {ref}`Image2`. Imaging used two channels: 488 nm for deGFP and 561 nm for rhodamine. At the start of incubation (t = 0), no deGFP signal was detected inside the cells. By the endpoint (t = 3 hours), a substantial fraction of cells exhibited deGFP fluorescence, indicating expression from the DNA template over time through cytosolic transcription and translation.

:::::{tab-set}

::::{tab-item} Image 1
:::{figure} experiments/Image1.png
:label: Image1
Combined green (488 nm) and red (561 nm) fluorescence channels. Timepoint 0 (t = 0) corresponds to 30 minutes after preparation of the inner solution, reflecting the time required to prepare liposomes.
:::
::::

::::{tab-item} Image 2
:::{figure} experiments/Image2.png
:label: Image2
Combined green (488 nm) and red (561 nm) fluorescence channels. Timepoint 0 (t = 0) corresponds to 30 minutes after preparation of the inner solution, reflecting the time required to prepare liposomes.
:::
::::
:::::


# Conclusions and next steps

This DevNote presents the initial testing of the Nucleus Base Cell. The Base Cell functions as a foundational synthetic-cell platform engineered to support modular extensions for biotechnological applications and future synthetic cell development.
