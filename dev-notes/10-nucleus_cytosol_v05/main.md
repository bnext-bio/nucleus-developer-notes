---
# Ensure that this title is the same as the one in `myst.yml`
title: "First Nucleus Cytosol Testing"
abstract: |
 PURE serves as a foundational platform for constructing synthetic cells from the bottom up. In this Developer Note, we present the first evaluation of Nucleus Cytosol, an open-source PURE system, by assessing the expression and yield of deGFP in comparison to a commercial PURE system. Our results show that Nucleus Cytosol performs comparably, with optimal protein expression achieved at a final Mg$^{2+}$ concentration of 8 mM. 
---

# Overview

The cytosol is the internal compartment of a synthetic cell containing proteins, RNAs, small organic molecules, and salts that collectively define its biochemical environment and support user-defined biological functions {ref}`illustration`. Nucleus Cytosol is based on the PURE system, consisting of a defined set of proteins and small molecules that reconstitute the essential transcription and translation machinery required for protein synthesis from DNA templates [[Shimizu *et al.* 2001](https://doi.org/10.1038/90802)]. Nucleus Cytosol comprises the essential components required for *in vitro* protein synthesis: a protein mix (PMix), a small-molecule mix (SMix), A19 tRNAs, A19 ribosomes, Mg$^{2+}$ ions (magnesium acetate), and a pOpen-deGFP gene expression template driven by the T7 transcription system. 

:::{figure} ./figures/illustration2.png
:name: illustration
:align: center
:width: 50%

A schematic representation of PURE converting template DNA into a fluorescent reporter. 
:::

- **PMix:** The PMix contains all 36 essential PURE proteins required to reconstitute *in vitro* transcription and translation [[Shimizu *et al.* 2001](https://doi.org/10.1038/90802)]. It includes T7 RNA polymerase, 20 aminoacyl-tRNA synthetases, methionyl-tRNA formyltransferase (MTF), three translation initiation factors (IF1, IF2, IF3), three translation elongation factors (EF-G, EF-Tu, EF-Ts), three translation release factors (RF1, RF2, RF3), the ribosome recycling factor (RRF), and four enzymes involved in energy regeneration (creatine kinase 'CK', adenylate kinase 'AK', nucleoside diphosphate kinase 'NDK', and inorganic pyrophosphatase 'PPiase'). For the detailed composition of the PMix, see {ref}`PMix`.


- **SMix:** The SMix contains all small molecules required for efficient *in vitro* protein synthesis. It includes HEPES-KOH (pH 7.6), potassium glutamate, rNTPs (ATP, GTP, UTP, CTP), all 20 amino acids, creatine phosphate, folinic acid, spermidine, and TCEP. tRNAs and magnesium acetate are not included in the SMix and are instead added directly to the reaction. The detailed composition of the SMix is provided in {ref}`SMix`.


- **tRNAs and Ribosomes:** tRNAs and ribosomes are purified from the *E. coli* A19 strain, which is deficient in RNase I, an enzyme that degrades RNA. 


- **pOpen-deGFP:** The pOpen-deGFP construct was designed to carry out deGFP expression via the T7 transcription system in Nucleus Cytosol {ref}`seq-degfp`. The plasmid sequence is attached to this DevNote.

Here, we demonstrate that Nucleus Cytosol performs comparably to commercial PURExpress system in terms of final protein yield. We also performed a magnesium acetate titration to determine the optimal Mg$^{2+}$ concentration for the system. Some component concentrations are still being standardized; therefore, detailed manufacturing protocols for each component of Nucleus Cytosol will be released later through Nucleus Distribution.


# Base Cytosol Composition

The base composition of Nucleus Cytosol is summarized in the following tables. Across all experiments, the listed concentrations of each component were maintained, except for those intentionally varied, which are described later in the {ref}`Results` section. The concentration of each protein in the PMix is listed in {ref}`PMix`. The PMix was prepared at a stock concentration of 15 mg/mL, with a final concentration of 1.8 mg/mL in the reaction. Ribosomes were prepared at a stock concentration of 10 $\mu$M, with a final concentration of 1.8 $\mu$M in the reaction.

::::::{tab-set}

:::::{tab-item} pOpen-deGFP
::::{figure}
:label: seq-degfp
:::{seqviz} ./plasmids/pOpen-deGFP.gb
:height: 600px  
:::
Plasmid map of `pOpen-deGFP`.
::::
:::::

::::{tab-item} SMix composition
:::{table} SMix composition
:label: SMix
:align: center
| **Component** | **Concentration in SMix (mM) [4X]** |
| --- | --- |
| HEPES-KOH (pH 7.6) | 200 |
| Potassium glutamate | 400 |
| rATP | 8 |
| rGTP | 8 |
| rCTP | 4 |
| rUTP | 4 |
| Amino acids (each) | 1.2 |
| Creatine phosphate (CP) | 80 |
| Folinic acid | 0.08 |
| Spermidine | 8 |
| TCEP | 4 |
:::
::::

::::{tab-item} PMix composition
:::{table} PMix composition
:label: PMix
:align: center
| **Protein** | **Protein Concentration in PMix ($\mu$g/mL)** |
| --- | --- |
| AlaRS | 887.01 |
| ArgRS | 24.73 |
| AsnRS	| 278.63 |
| AspRS	| 102.22 |
| CysRS	| 14.84 |
| GlnRS	| 47.81 |
| GluRS	| 159.93 | 
| GlyRS	| 122.01 |
| HisRS	| 9.89 |
| IleRS	| 507.81 |
| LeuRS	| 51.11 |
| LysRS	| 80.79 |
| MetRS	| 29.68 |
| PheRS	| 215.98 |
| ProRS	| 126.95 |
| SerRS	| 24.73 |
| ThrRS	| 79.14 |
| TrpRS	| 79.14 |
| TyrRS	| 8.24 |
| ValRS	| 23.08 |
| IF1	| 126.95 |
| IF2	| 507.81 |
| IF3   | 126.95 |
| EF-G	| 634.76 |
| EF-Tu	| 6340.98 |
| EF-Ts	| 634.76 |
| RF1	| 126.95 |
| RF2	| 126.95 |
| RF3	| 126.95 |
| RRF	| 126.95 |
| MTF	| 253.90 |
| CK	| 51.11 |
| AK	| 37.92 |
| NDK	| 13.19 |
| PPiase | 13.19 |
| T7RNAP | 126.95 |
:::
::::

::::{tab-item} Reaction composition
:::{table} Reaction composition
:label: RC
:align: center
| **Component** | **Stock Concentration** | **Final Concentration in Reaction** | 
| --- | --- | --- |
| PMix | 15 mg/mL | 1.8 mg/mL
| SMix | 4X | 1X |
| Ribosomes | 10 $\mu$M | 1.8 $\mu$M |
| tRNA | *varies* | 3.5 mg/mL |
| pOpen-deGFP | *varies* | 3 nM |
| Magnesium acetate | 200 mM | *varies* |
:::
::::

::::::

(Results)=
# Results

## pOpen-deGFP expression in Cytosol

To evaluate the activity of Nucleus Cytosol, we expressed deGFP using the pOpen-deGFP plasmid. The plasmid was prepared with the ZymoPURE II Plasmid Maxiprep Kit (Cat. #D4203) following the manufacturer’s protocol, with an additional ethanol precipitation step to remove residual salts and impurities. The ethanol precipitation protocol used is attached to this DevNote.

Two preparations of pOpen-deGFP were tested: one obtained directly from the maxiprep and another that underwent the additional ethanol precipitation step. This comparison was performed to assess any notable differences in performance between the two DNA preparations. Both DNA samples were also tested in a commercial PURExpress system as controls to benchmark Cytosol performance. A negative control Cytosol reaction lacking the pOpen-deGFP template was included. Detailed reaction setup and component concentrations are provided in the attached Lab Notebook Entry. Cytosol reactions were carried out with a final magnesium acetate concentration of 8 mM, added exogenously during setup. A 35 $\mu$L mastermix was prepared for each reaction, and 10 $\mu$L aliquots were dispensed in triplicate into a 384-well plate for fluorescence measurements. 

The protein expression results indicate that Nucleus Cytosol performs comparably to the PURExpress system, achieving similar final protein yields ({ref}`fig1-kinetics` and {ref}`fig1-endpoint`). Minor differences were observed between the two DNA preparations-maxiprep alone and maxiprep followed by ethanol precipitation—but these variations were not significant enough to establish one method as superior. Interestingly, the maxiprep + ethanol precipitation template yielded slightly higher expression in PURExpress, whereas the maxiprep-only template performed better in Nucleus Cytosol. Subsequent experiments described in this DevNote were conducted using the maxiprep + ethanol precipitation DNA template.

:::::{tab-set}

::::{tab-item} Time series
:sync: tab1-1
:::{figure} #fig:kinetics-exp1
:name: fig1-kinetics
:align: center
:width: 75%

Translation kinetics of Cytosol and PURExpress reactions using two different pOpen-deGFP DNA preps. Cytosol w/o DNA refers to the Cytosol reaction lacking the pOpen-deGFP template.
:::
::::

::::{tab-item} End point
:sync: tab1-2
:::{figure} #fig:endpoint-exp1
:name: fig1-endpoint
:align: center
:width: 75%

Final protein yields of the reactions measured at steady state.
:::
::::

:::::

## Magnesium acetate titration in Nucleus Cytosol

The concentration of magnesium ions is a critical determinant of protein synthesis efficiency in PURE reactions [[Li *et al.* 2017](https://doi.org/10.1080/21690731.2017.1327006)]. To assess the performance of Nucleus Cytosol across varying magnesium acetate concentrations and identify optimal conditions for future experiments, we performed a titration over a range of 4–12 mM in 2 mM increments. This range was selected based on prior results showing that 8 mM magnesium acetate yielded performance comparable to PURExpress, allowing us to explore both lower and higher concentrations for potential improvement. Detailed reaction setup and component concentrations are provided in the attached Lab Notebook Entry. For each condition, a 35 $\mu$L mastermix was prepared, and 10 $\mu$L aliquots were dispensed in triplicate into a 384-well plate for fluorescence measurements.

Magnesium acetate titration revealed that the initially used concentration of 8 mM was optimal for achieving the highest deGFP protein yield, comparable to the PURExpress positive control ({ref}`fig2-kinetics` and {ref}`fig2-endpoint`). Deviations from this concentration, either lower or higher, resulted in reduced overall protein expression.

:::::{tab-set}

::::{tab-item} Time series
:sync: tab1-1
:::{figure} #fig:kinetics-exp2
:name: fig2-kinetics
:align: center
:width: 75%

Magnesium acetate titration in Nucleus Cytosol showed that a final concentration of 8 mM in the reaction produced the highest deGFP protein yield.
:::
::::

::::{tab-item} End point
:sync: tab1-2
:::{figure} #fig:endpoint-exp2
:name: fig2-endpoint
:align: center
:width: 75%

Final protein yields of the reactions measured at steady state.
:::
::::

:::::

# Conclusions and next steps

Here, we showed that Nucleus Cytosol performs equivalently to other commerically available PURExpress system and characterize the `pOpen-T7-deGFP` DNA template. Next steps will involve characterizing other Nucleus Modules in Cytosol.
