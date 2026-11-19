package com.biblioteca.controller;

import com.biblioteca.model.Autor;
import com.biblioteca.model.Livro;
import com.biblioteca.repository.AutorRepository;
import com.biblioteca.repository.LivroRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LivroController.class)
class LivroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LivroRepository livroRepository;

    @MockBean
    private AutorRepository autorRepository;

    private Autor autor() {
        Autor a = new Autor();
        a.setId(1L);
        a.setNome("Machado de Assis");
        return a;
    }

    private Livro livro(Long id, String titulo) {
        Livro l = new Livro();
        l.setId(id);
        l.setTitulo(titulo);
        l.setAutor(autor());
        return l;
    }

    private static final String JSON_LIVRO =
            "{\"titulo\":\"Dom Casmurro\",\"isbn\":\"978-8535910667\",\"anoPublicacao\":1899,"
                    + "\"genero\":\"Romance\",\"autor\":{\"id\":1}}";

    @Test
    void deveCriarLivroComSucesso() throws Exception {
        when(autorRepository.findById(1L)).thenReturn(Optional.of(autor()));
        when(livroRepository.save(any(Livro.class))).thenReturn(livro(10L, "Dom Casmurro"));

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(JSON_LIVRO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.autor.id").value(1));
    }

    @Test
    void deveRetornar404ParaLivroInexistente() throws Exception {
        when(livroRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/livros/99"))
                .andExpect(status().isNotFound());
    }

    // ---- extras ----

    @Test
    void deveListarLivrosOrdenados() throws Exception {
        when(livroRepository.findAllByOrderByTituloAsc())
                .thenReturn(List.of(livro(1L, "Dom Casmurro"), livro(2L, "Memórias Póstumas")));

        mockMvc.perform(get("/api/livros"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Dom Casmurro"))
                .andExpect(jsonPath("$[1].titulo").value("Memórias Póstumas"));
    }

    @Test
    void deveRejeitarLivroSemAutor() throws Exception {
        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"Sem autor\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornar400QuandoAutorNaoExiste() throws Exception {
        when(autorRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(JSON_LIVRO))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornar404AoDeletarLivroInexistente() throws Exception {
        when(livroRepository.existsById(99L)).thenReturn(false);

        mockMvc.perform(delete("/api/livros/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveListarLivrosDeUmAutor() throws Exception {
        when(livroRepository.findByAutorId(1L)).thenReturn(List.of(livro(1L, "Dom Casmurro")));

        mockMvc.perform(get("/api/livros/autor/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Dom Casmurro"));
    }
}
