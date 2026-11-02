# 🐺🐇 Simulador Lotka-Volterra — Predador-Presa

Simulação ecológica interativa de dinâmica populacional usando o modelo clássico de Lotka-Volterra com retrato de fase orbital.

## 🚀 Funcionalidades

- **Sistema clássico de Lotka-Volterra** integrado numericamente, com parâmetros α, β, γ, δ ajustáveis.
- **Retrato de Fase Orbital Espaço-Temporal** — Trajetórias fechadas em torno do ponto fixo não-trivial $(\gamma/\delta, \alpha/\beta)$.
- **4 Cenários Clássicos** — Equilíbrio Coexistente, Explosão Populacional, Quase-Extinção e Ciclo Limite.

## 🧮 Modelagem Matemática & Dinâmica Não-Linear

### 1. Sistema clássico (implementado)

$$\frac{dx}{dt} = \alpha x - \beta x y, \qquad \frac{dy}{dt} = \delta x y - \gamma y$$

> 🗺️ **Roadmap (não implementado):** extensão com capacidade de suporte $K$ e resposta funcional de Holling Tipo II, verificação numérica da primeira integral $V(x,y)$ e ruído estocástico de Itô.

### [Roadmap] Sistema Não-Linear com Resposta de Holling Tipo II

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
