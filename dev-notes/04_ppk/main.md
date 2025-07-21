---
# Ensure that this title is the same as the one in `myst.yml`
title: PPK Module testing in PURExpress
abstract: |
  Efficient energy regeneration is critical for sustaining protein synthesis in the PURE (Protein synthesis Using Recombinant Elements) system. Traditionally, the creatine phosphate/creatine kinase (CP/CK) module, supplemented with adenylate kinase and nucleoside-diphosphate kinase, has been employed to fulfill this role. In this study, we explored the implementation of a polyphosphate kinase (PPK2)-based energy regeneration system within the PURExpress platform. While previous work has demonstrated the effectiveness of PPK2 in supporting mRNA-driven protein synthesis, we extend these findings by showing that PPK2 can also support protein synthesis when DNA is used as the expression template. Furthermore, we demonstrate that combining the PPK2 module with the existing CP/CK system results in a synergistic effect, enhancing protein production by over 96% relative to the CP/CK module alone. These results highlight the potential of modular energy regeneration strategies to improve the efficiency and yield of *in vitro* protein synthesis in the PURE system.
---

# Introduction: energy regeneration in PURE

Energy regeneration is a vital component of the PURE (Protein synthesis Using Recombinant Elements) system, ensuring the continuous supply of high-energy nucleotides, ATP and GTP, necessary for efficient protein synthesis. This process is traditionally maintained by a combination of three kinases: creatine kinase (CK), adenylate kinase (AK), and nucleoside-diphosphate kinase (NDK). CK regenerates ATP from ADP using creatine phosphate (CP), while AK converts AMP to ADP, and NDK generates GTP from GDP using ATP as a phosphate donor.

In previous work, Wang et al. demonstrated that these three kinases could be functionally replaced by a single enzyme, polyphosphate kinase (PPK2) [EC 2.7.4.1](https://www.uniprot.org/uniprotkb/A0A6N4SMB5/entry), in conjunction with its substrate, polyphosphate (polyP) [[Wang *et al.* 2019](https://doi.org/10.1021/acssynbio.9b00456)]. This alternative energy regeneration module enabled the direct synthesis of ATP and GTP from AMP and GDP, respectively ({ref}`fig:PPK illustration`). Using mRNA-driven protein synthesis, the PPK2-based system outperformed the traditional three-kinase module, yielding approximately 32% more protein and achieving translation rates nearly five times faster. 

In this study, we evaluated the performance of the PPK2-based energy regeneration module in the PURExpress system using DNA-driven protein synthesis. To enable this, we replaced Solution A of the PURExpress kit with a custom-made energy solution (ES) to incorporate the PPK2 module. Our results showed that, while the unoptimized PPK2 module is capable of supporting energy regeneration, its efficiency was much lower compared to the conventional CP/CK module. However, when both the CP/CK and PPK2 modules were combined, we observed a substantial enhancement in protein production, with yields increasing by nearly 96% relative to the CP/CK module alone.

:::{figure} ./figures/PPK-illustration.png
:label: fig:PPK illustration
:width: 75%
Illustration of the PPK2 based energy regeneration the PURE system
:::

# Testing custom energy mix in PURExpress

To evaluate energy regeneration using the PPK2 module, it was first necessary to suppress the activity of the native CP/CK-based module in the PURExpress system. Ideally, this would involve removing the three kinases (CK, AK, and NDK) from the PURE protein mix, along with eliminating CP from the energy solution. However, since modifying the commercial PURExpress components directly was not feasible, we adopted an alternative strategy. We prepared a custom energy solution to replace PURExpress Solution A, omitting only the CP substrate. This approach, previously used to evaluate synthetic energy module in the PURE system [[Yadav *et al.* 2025](https://doi.org/10.1021/acssynbio.4c00697)], enabled rapid testing of the PPK2-based system. The formulation of the custom energy solution is provided in ({ref}`table-energy-mix-composition`).

:::{table} Composition of custom-made energy solution
:label: table-energy-mix-composition
:align: center
| Component | Stock concentration (mM) | Concentration of components in reaction (mM) | Concentration in Energy solution  (mM) | Final volume to add (µL) |
| --- | --- | --- | --- | --- |
| HEPES | 1000 | 50 | 150 | 30.0 |
| Potassium glutamate | 2500 | 100 | 300 | 24.0 |
| Magnesium acetate | 1000 | 11.8 | 35.4 | 7.1 |
| NTP | 100 | 2 | 6 | 12.0 |
| tRNA (mg/mL) | 40 | 3.5 | 10.5 | 52.5 |
| Creatine phosphate | 1000 | 0 | 0 | 0.0 |
| TCEP | 500 | 1 | 3 | 1.2 |
| Folinic acid | 5 | 0.02 | 0.06 | 2.4 |
| Spermidine | 200 | 2 | 6 | 6.0 |
| Amino acid solution | 3.25 | 0.3 | 0.9 | 55.4 |
| Water |  |  |  | 9.4 |
|  |  |  |  |  |
| Energy solution total |  | Final concentration (fold) |  | Final volume |
|  |  | 3 |  | 200 |

:::
To validate that the removal of CP alone was sufficient to deactivate the system, two reactions were assembled, one containing CP and one without it ({ref}`table-exp-para-1`, also see detailed composition in the attached Lab Notebook entry). A PURExpress Positive Control (PC) was included to benchmark activity. As expected, eliminating CP from the reaction completely abolished protein synthesis of plamGFP, confirming CP's essential role in driving the reaction ({ref}`fig2-kinetics` and {ref}`fig3-endpoint`). Furthermore, the protein yield from the reaction using the custom energy solution (with a final concentration of 20 mM CP) was more than four times lower than that of the PURExpress PC ({ref}`fig2-kinetics` and {ref}`fig3-endpoint`). A possible explanation for this observation could be the differing concentrations of components in the homemade custom energy solution compared to PURExpress Solution A, which is likely optimized to function synergistically with PURExpress Solution B. These findings prompted us to optimize the magnesium concentration in the custom energy solution, as we had initially used 11.8 mM final magnesium acetate concentration in the reaction. In subsequent experiments, magnesium acetate was titrated directly into the final reaction mixture to identify the optimal concentration. Despite the need for further optimization, these results confirm that removing CP from the energy solution is sufficient to deactivate the reaction and provides a valid strategy for testing alternative energy modules, such as PPK2, by supplementing with the PPK2 enzyme and its polyP substrate.

:::{table} Description of experimental parameters
:label: table-exp-para-1
:align: center

| Condition | Description |
| --- | --- |
| ES + CP  | Reaction using custom ES + 20 mM CP added in the final reaction |
| ES - CP  | Reaction using custom ES with no added CP |
| PURE Positive  | PURExpress positive control reaction |

:::

:::::{tab-set}

::::{tab-item} Time series
:sync: tab1-1
:::{figure} #fig:kinetics-exp1
:name: fig2-kinetics
:align: center
:width: 75%

Translation kinetics of PURE reactions using the custom energy solution with or without CP. The "PURE Positive" refers to the PURExpress reaction using Solutions A and B.
:::
::::

::::{tab-item} End point
:sync: tab1-2
:::{figure} #fig:endpoint-exp1
:name: fig3-endpoint
:align: center
:width: 75%

Final protein yields of the three reactions measured at steady state.
:::
::::

:::::

# Mg$^{2+}$ optimization using custom energy mix

Magnesium acetate optimization was carried out to determine the optimal magnesium concentration for the PURE reaction using the custom energy solution. A new batch of the energy solution was prepared without magnesium acetate, allowing magnesium to be added directly to the final reaction mixture at concentrations ranging from 6 mM to 12 mM. Detailed reaction setup information is provided in the attached lab notebook entry.

Direct titration of magnesium acetate revealed that a final concentration of 8 mM yielded the highest protein production. Notably, this yield was comparable to that of the PURExpress Positive Control (PC) reaction ({ref}`fig:fig4-mg-opt`). It is important to clarify that no PPK2 module was included in this set of experiments; these reactions were solely based on the CP/CK energy regeneration module.

:::{figure} #fig:endpoint-exp2
:label: fig:fig4-mg-opt
:width: 75%
Magnesium acetate titration in PURE reactions using the custom energy solution with 20 mM CP added to the final reaction. "PC" refers to the PURExpress Positive Control reaction using Solutions A and B.
:::

# PPK2 module testing in PURExpress using custom energy mix

Following magnesium optimization of the PURE reaction using our custom energy solution, we proceeded to evaluate the performance of the PPK2-based energy regeneration module. For these experiments, the custom energy solution was prepared without creatine phosphate (CP), as the PPK2 module relies on polyphosphate (polyP) as its phosphate donor. We hypothesized that optimal function of the PPK2 module might require a higher concentration of magnesium ions compared to the CP/CK module, due to the potential for polyP to chelate free Mg$^{2+}$ ions in the reaction mixture, thereby reducing the availability of free magnesium necessary for efficient protein synthesis [[Li *et al.* 2017](https://doi.org/10.1080/21690731.2017.1327006)].

To test this, we initially titrated magnesium acetate in the range of 8 mM to 14 mM. Among these conditions, only the reaction containing 14 mM Mg$^{2+}$ demonstrated protein synthesis activity above baseline, suggesting that lower magnesium concentrations were insufficient in the presence of polyP ({ref}`fig5-PPK1`). Interestingly, in the CP/CK module, the addition of 30 mM polyP completely inhibited protein synthesis ({ref}`fig5-PPK1`), further supporting the idea that polyP may exert an inhibitory effect on the PURE system, likely through magnesium chelation. The observed rescue of activity in the PPK2 reactions at higher magnesium concentrations reinforces this hypothesis. Detailed reaction setup information is provided in the attached lab notebook entry.

Subsequently, we extended the magnesium titration range and found that the PPK2-driven reaction reached optimal protein yields at 16–18 mM Mg$^{2+}$ ({ref}`fig6-PPK2`). This optimal concentration was approximately 10 mM higher than that required for the CP/CK module, underscoring the critical need to fine-tune magnesium concentrations for different energy regeneration modules in the PURE system. Importantly, these results demonstrate that the PPK2 module is capable of supporting DNA-driven protein synthesis in the PURE system, establishing it as a viable and effective energy regeneration module.

:::::{tab-set}

::::{tab-item} 8-14 mM Mg
:sync: tab2-1
:::{figure} #fig:endpoint-exp3
:name: fig5-PPK1
:align: center
:width: 50%

Final protein yields of PPK2-powered PURE reactions at different Mg$^{2+}$ concentrations. PPK2 enzyme and polyP were added at a final concetration of 2 µM and 30 mM, respectively. The "CP + polyP + 8 mM Mg" refers to the PURE reactions using the custom energy solution, with 20 mM CP and 30 mM polyP at final concetrations (without any PPK2 enzyme).
:::
::::

::::{tab-item} 14-20 mM Mg
:sync: tab2-2
:::{figure} #fig:endpoint-exp4
:name: fig6-PPK2
:align: center
:width: 75%

Final protein yields of PPK2-powered PURE reactions at different Mg$^{2+}$ concentrations. PPK2 enzyme and polyP were added at a final concetration of 2 µM and 30 mM, respectively.
:::
::::

:::::

# Combining CP/CK and PPK2 module for energy regeneration

Encouraged by the promising results obtained with the PPK2 module as an alternative energy regeneration system, we sought to enhance protein synthesis efficiency by combining the CP/CK and PPK2 modules to leverage the strengths of both simultaneously. To achieve this, we used the optimized PPK2 reaction setup with 18 mM Mg$^{2+}$ and supplemented it with 20 mM creatine phosphate (CP) to activate the CP/CK module.

To compare translation kinetics and final protein yields across different energy regeneration strategies, we assembled three experimental conditions: (1) the CP/CK module alone with 8 mM Mg$^{2+}$ (optimized condition), (2) the PPK2 module alone with 18 mM Mg$^{2+}$ (optimized condition), and (3) a combined CP/CK and PPK2 module with 18 mM Mg$^{2+}$. In addition, a PURExpress positive control reaction and a negative control reaction (lacking DNA) were included for reference. Detailed reaction setup information is provided in the attached lab notebook entry.

Our results showed that, while the PPK2 module is capable of supporting energy regeneration, its efficiency was much lower (77%) compared to the conventional CP/CK module in terms of final protein yield ({ref}`fig7-kinetics` and {ref}`fig8-endpoint`). However, when both the CP/CK and PPK2 modules were combined, we observed a substantial enhancement in protein production, with yields increasing by nearly 96% relative to the CP/CK module alone ({ref}`fig7-kinetics` and {ref}`fig8-endpoint`).

:::{table} Description of experimental parameters
:label: table-exp-para-2
:align: center

| Condition | Description |
| --- | --- |
| PURE w/CP 8 mM Mg$^{2+}$  | Reaction using custom energy solution + 20 mM CP and 8 mM Mg$^{2+}$ added in the final reaction |
| PURE w/PPK + polyP 18 mM Mg$^{2+}$  | Reaction using custom energy solution + 30 mM polyP, 2 µM PPK2, and 18 mM Mg$^{2+}$ added in the final reaction |
| PURE w/CP + PPK + polyP 18 mM Mg$^{2+}$  | Reaction using custom energy solution + 20 mM CP, 30 mM polyP, 2 µM PPK2, and 18 mM Mg$^{2+}$ added in the final reaction |
| PURExpress PC  | PURExpress positive control reaction |
| PURExpress NC  | PURExpress negative control reaction lacking DNA template |

:::

:::::{tab-set}

::::{tab-item} Time series
:sync: tab3-1
:::{figure} #fig:kinetics-exp5
:name: fig7-kinetics
:align: center
:width: 75%

Translation kinetics of PURE reactions using different energy modules. The PPK2 module performed approximately 77% lower than the CP/CK module. However, the combination of PPK2 and CP/CK modules resulted in approximately  96% higher final protein yield than the CP/CK module alone.
:::
::::

::::{tab-item} End point
:sync: tab3-2
:::{figure} #fig:endpoint-exp5
:name: fig8-endpoint
:align: center
:width: 75%

Final protein yields of the reactions measured at steady state. The PPK2 module performed approximately 77% lower than the CP/CK module. However, the combination of PPK2 and CP/CK modules resulted in approximately  96% higher final protein yield than the CP/CK module alone.
:::
::::

:::::

# Conclusion & future directions 

In this developer note, we highlight a key finding: the PPK2-based energy regeneration module can function as an effective additional energy source in the PURE system, supporting DNA-driven protein synthesis. When combined with the conventional CP/CK module, the PPK2 module contributes to a significant increase in final protein yields.

Equally important is the role of magnesium ion concentration in optimizing protein synthesis. Our results demonstrate that different energy regeneration modules have distinct magnesium requirements, and that tuning this parameter is critical for maximizing performance. Although only preliminary magnesium optimization was performed in this study, our findings suggest that further improvements in yield could be achieved through additional optimization of magnesium levels, polyphosphate (polyP) substrate concentration, and PPK2 enzyme dosage in the combined module reaction.

Overall, the results presented here underscore the potential of modular energy regeneration strategies to enhance the efficiency and output of *in vitro* protein synthesis in the PURE system.
