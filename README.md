# 🐺🐇 Simulador Lotka-Volterra — Predador-Presa

Simulação ecológica interativa de dinâmica populacional usando o modelo clássico de Lotka-Volterra com retrato de fase orbital.

## 🚀 Funcionalidades

- **Constante de Movimento (Invariante de Lyapunov / Primeira Integral)** — Verificação numérica estrita da conservação de energia do sistema orbital conservativo.
- **Resposta Funcional de Holling Tipo II (Saturação)** — Modelagem biológica realista onde predadores possuem tempo de manipulação (*handling time*), prevenindo taxas irreais de predação infinita.
- **Estocasticidade Demográfica por Difusão de Itô** — Flutuações randômicas ambientais nos coeficientes vitais.
- **Retrato de Fase Orbital Espaço-Temporal** — Trajetórias fechadas em torno do ponto fixo não-trivial $(\gamma/\delta, \alpha/\beta)$.
- **4 Cenários Clássicos** — Equilíbrio Coexistente, Explosão Populacional, Quase-Extinção e Ciclo Limite.

## 🧮 Modelagem Matemática & Dinâmica Não-Linear

### 1. Sistema Não-Linear com Resposta de Holling Tipo II

$$\begin{aligned}
\frac{dx}{dt} &= \alpha x \left(1 - \frac{x}{K}\right) - \frac{\beta x y}{1 + a x} \\
\frac{dy}{dt} &= \frac{\delta \beta x y}{1 + a x} - \gamma y
\end{aligned}$$

### 2. Invariante de Movimento (Primeira Integral de Lotka-Volterra)

$$V(x, y) = \delta x - \gamma \ln(x) + \beta y - \alpha \ln(y) = \text{Constante}$$

Garante que as órbitas no espaço de fase sejam curvas de nível fechadas no caso não-amortecido, provando estabilidade no sentido de Lyapunov.

## 🛠️ Tecnologias

- JavaScript Vanilla (ES6+)
- Chart.js 4.4 (Scatter, Line)
- CSS3 com Glassmorphism
- Método numérico Runge-Kutta 4ª ordem

## 📦 Como Executar

Abra `index.html` no navegador — Chart.js carregado via CDN.

## 📁 Estrutura

```
lotka-volterra/
├── index.html    # Layout e controles
├── script.js     # Motor de simulação ecológica
└── style.css     # Design premium dark theme
```

## ⚠️ Hipóteses do Modelo e Limitações

1. **Sistema Ecológico de Duas Espécies Isoladas**: Modela a interação direta entre uma população de presas ($x$) e uma de predadores ($y$), abstraindo teias tróficas multiespécies, migração espacial e sazonalidade climática.
2. **Estabilidade Numérica**: O integrador Runge-Kutta de 4ª ordem (RK4) preserva a primeira integral $V(x,y)$ com erro de truncamento global $\mathcal{O}(\Delta t^4)$ no regime conservativo ($a = 0, K \to \infty$), ao passo que métodos de Euler explícitos introduziriam espiralamento artificial.

---

Desenvolvido por **Geovana** | Distribuído sob Licença MIT (`LICENSE`) | [Portfólio](../portfolio/index.html)
