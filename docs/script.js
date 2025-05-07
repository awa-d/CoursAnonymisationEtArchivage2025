document.addEventListener('DOMContentLoaded', function() {
    // Références aux éléments DOM
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('.section');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Toggle du menu mobile
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Navigation entre les sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Supprimer la classe active de tous les liens
            navLinks.forEach(item => item.classList.remove('active'));
            
            // Ajouter la classe active au lien cliqué
            this.classList.add('active');
            
            // Masquer toutes les sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Afficher la section correspondante
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
            
            // Fermer le menu mobile après la navigation
            navMenu.classList.remove('active');
            
            // Scroller vers le haut de la page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Fonction de recherche
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            alert('Veuillez entrer au moins 2 caractères pour la recherche.');
            return;
        }
        
        // Masquer toutes les sections d'abord
        sections.forEach(section => section.classList.remove('active'));
        
        // Afficher la section accueil par défaut
        const accueilSection = document.getElementById('accueil');
        accueilSection.classList.add('active');
        
        // Créer une section pour les résultats de recherche
        let resultsSection = document.getElementById('search-results');
        
        if (!resultsSection) {
            resultsSection = document.createElement('div');
            resultsSection.id = 'search-results';
            resultsSection.className = 'search-results container';
            accueilSection.appendChild(resultsSection);
        } else {
            // Nettoyer les résultats précédents
            resultsSection.innerHTML = '';
        }
        
        // Rechercher dans le contenu
        let found = false;
        let resultsHTML = `<h3>Résultats de recherche pour "${searchTerm}" :</h3><ul class="search-results-list">`;
        
        sections.forEach(section => {
            const sectionText = section.textContent.toLowerCase();
            const sectionId = section.id;
            const sectionTitle = section.querySelector('h2') ? section.querySelector('h2').textContent : sectionId;
            
            if (sectionText.includes(searchTerm)) {
                found = true;
                
                // Trouver des correspondances plus précises
                const paragraphs = section.querySelectorAll('p, li, h3, h4');
                let matchingParagraphs = [];
                
                paragraphs.forEach(p => {
                    if (p.textContent.toLowerCase().includes(searchTerm)) {
                        matchingParagraphs.push(p.textContent);
                    }
                });
                
                // Limiter à 2 résultats par section
                if (matchingParagraphs.length > 2) {
                    matchingParagraphs = matchingParagraphs.slice(0, 2);
                }
                
                resultsHTML += `
                    <li>
                        <a href="#" class="search-result-link" data-target="${sectionId}">
                            <strong>${sectionTitle}</strong>
                        </a>
                        <ul class="search-matches">
                            ${matchingParagraphs.map(p => {
                                // Limiter la longueur du texte et mettre en évidence le terme recherché
                                let text = p;
                                if (text.length > 150) {
                                    const index = text.toLowerCase().indexOf(searchTerm);
                                    const start = Math.max(0, index - 50);
                                    text = (start > 0 ? '...' : '') + text.substring(start, start + 150) + '...';
                                }
                                return `<li>${text.replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`)}</li>`;
                            }).join('')}
                        </ul>
                    </li>
                `;
            }
        });
        
        resultsHTML += '</ul>';
        
        if (!found) {
            resultsHTML = `<h3>Résultats de recherche pour "${searchTerm}" :</h3><p>Aucun résultat trouvé.</p>`;
        }
        
        resultsSection.innerHTML = resultsHTML;
        
        // Ajouter des écouteurs d'événements aux liens de résultats
        document.querySelectorAll('.search-result-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Supprimer la section de résultats
                resultsSection.remove();
                
                // Afficher la section cible
                const targetId = this.getAttribute('data-target');
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
                
                // Mettre à jour la navigation
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === `#${targetId}`) {
                        navLink.classList.add('active');
                    }
                });
                
                // Scroller vers le haut
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Événement de clic pour le bouton de recherche
    searchButton.addEventListener('click', performSearch);
    
    // Événement de pression de touche pour la recherche
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Code pour les FAQ (questions/réponses)
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.question');
        const answer = item.querySelector('.answer');
        
        // Style initial (optionnel)
        // answer.style.display = 'none';
        
        question.addEventListener('click', () => {
            // Toggle pour afficher/masquer la réponse (décommenté si vous voulez cette fonctionnalité)
            // answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
            
            // Alternative: ajouter/supprimer une classe pour l'animation
            // answer.classList.toggle('active');
        });
    });

    // Initialisation - s'assurer qu'une section est active au chargement
    if (!document.querySelector('.section.active')) {
        sections[0].classList.add('active');
    }
});
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // On défile vers le bas -> cacher le header
    header.classList.add('hidden');
  } else {
    // On défile vers le haut -> montrer le header
    header.classList.remove('hidden');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Eviter les valeurs négatives
});

const slider = document.getElementById("slider");
const images = document.querySelectorAll(".slide-img");
let currentIndex = 0;

function showNextImage() {
  currentIndex++;
  
  if (currentIndex >= images.length) {
    currentIndex = 0;
  }

  const imageWidth = images[0].clientWidth + 20; // image + marge
  slider.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
}

setInterval(showNextImage, 2000); // Change toutes les 2 secondes
