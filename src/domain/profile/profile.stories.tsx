import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ProfileHtmlFrameProps } from "../../types/domain/profile/profile-html-frame-props.js";
import { Button } from "../../ui/button.js";

import { EditProfileDialog } from "./edit-profile-dialog.js";
import { GithubImportDialog } from "./github-import-dialog.js";
import { ProfessionalProfile } from "./professional-profile.js";
import { ProfileBannerDialog } from "./profile-banner-dialog.js";
import { ProfileBioDialog } from "./profile-bio-dialog.js";
import { ProfileCityPrivacy } from "./profile-city-privacy.js";
import { ProfileCommunityShelf } from "./profile-community-shelf.js";
import { ProfileExperiencesSection } from "./profile-experiences-section.js";
import { ProfileExplorePanel } from "./profile-explore-panel.js";
import { ProfileGamificationPanel } from "./profile-gamification-panel.js";
import { ProfileNetworkDialog } from "./profile-network-dialog.js";
import { ProfileProjectsSection } from "./profile-projects-section.js";
import { ProfileQuickComposer } from "./profile-quick-composer.js";
import { ProfileResumeDialog } from "./profile-resume-dialog.js";
import { ProfileSeals } from "./profile-seals.js";
import { ProjectFormDialog } from "./project-form-dialog.js";
import { ProjectsManager } from "./projects-manager.js";
import { SealEvidenceList } from "./seal-evidence-list.js";

const meta: Meta = {
  title: "Domain/Profile",
};

export default meta;

// Stories have no sandboxed frame: a plain srcdoc iframe stands in for the app's.
function frame({ html, title, className }: ProfileHtmlFrameProps) {
  return <iframe srcDoc={html} title={title} className={className} sandbox="" />;
}

const projects = [
  {
    id: "p1",
    title: "Énóis Connect",
    description: "Rede de networking com propósito, com perfil, vagas e comunidades.",
    stack: ["React", "TypeScript"],
    repoUrl: "https://github.com/exemplo/connect",
    status: "em andamento",
    diary: [
      { date: "2026-09-01", text: "Primeira versão no ar." },
      { date: "2026-10-01", text: "Perfil com projetos." },
    ],
  },
  {
    id: "p2",
    title: "Card em HTML",
    stack: [],
    repoUrl: null,
    status: null,
    diary: [],
    html: "<h2>Meu projeto</h2>",
  },
];

export const Panels: StoryObj = {
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <ProfileGamificationPanel
        profile={{ reputation: 42, badges: [] }}
        isOwner
        postsCount={12}
        walletBalance="1.250"
        walletHref="#"
      />

      <div className="space-y-4">
        <ProfileCommunityShelf
          communities={[
            {
              id: "c1",
              name: "Mulheres na Tecnologia",
              topicLabel: "Tecnologia",
              members: 1280,
              href: "#",
            },
          ]}
          loading={false}
          communitiesHref="#"
        />
        <ProfileExplorePanel dailyGamesHref="#" appearanceHref="#" />
      </div>
    </div>
  ),
};

export const Sections: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <ProfileQuickComposer profile={{ name: "Ana Souza" }} onPublish={async () => true} />
      <ProfileProjectsSection
        projects={projects}
        isOwner
        onManage={() => undefined}
        onImport={() => undefined}
        renderHtmlFrame={frame}
      />
      <ProfileExperiencesSection
        experiences={[
          {
            id: "e1",
            title: "Desenvolvedora front-end",
            company: "Énóis",
            location: "São Paulo",
            description: "Interfaces do app e do design system.",
            currentlyHere: true,
            startLabel: "jan. 2023",
            endLabel: null,
            months: 34,
          },
        ]}
      />
    </div>
  ),
};

export const Dialogs: StoryObj = {
  render: function DialogsStory() {
    const [open, setOpen] = useState<string | null>(null);
    const [tab, setTab] = useState<"info" | "experiences" | "education" | "certifications">("info");
    const toggle = (name: string) => (value: boolean) => setOpen(value ? name : null);

    return (
      <div className="flex flex-wrap gap-2">
        <EditProfileDialog
          profile={{ username: "ana", name: "Ana Souza", openToWork: true, isMentor: false }}
          open={open === "edit"}
          onOpenChange={toggle("edit")}
          tab={tab}
          onTabChange={setTab}
          onSave={async () => null}
          onUploadBadge={async () => "https://placehold.co/80"}
          experiences={[{ id: "x1", title: "Dev", company: "Énóis" } as { id: string }]}
          education={[]}
          certifications={[]}
          listPending={{ experiences: false, education: false, certifications: false }}
          onCreateItem={async () => undefined}
          onUpdateItem={async () => undefined}
          onDeleteItem={() => undefined}
        >
          <Button>Editar perfil</Button>
        </EditProfileDialog>

        <Button onClick={() => setOpen("banner")}>Capa</Button>

        <ProfileBannerDialog
          open={open === "banner"}
          onOpenChange={toggle("banner")}
          initialHtml={null}
          onPickPhoto={() => undefined}
          maxLength={20000}
          onSave={() => setOpen(null)}
          renderHtmlFrame={frame}
        />
        <ProfileBioDialog
          open={open === "bio"}
          onOpenChange={toggle("bio")}
          initialHtml="<p>Olá!</p>"
          maxLength={20000}
          onSave={() => setOpen(null)}
          renderHtmlFrame={frame}
        />
        <ProfileResumeDialog
          resumeUrl="/curriculo.pdf"
          resumeName="curriculo-ana.pdf"
          onUpload={() => undefined}
          onRemove={() => undefined}
        />

        <Button onClick={() => setOpen("network")}>Conexões</Button>

        <ProfileNetworkDialog
          name="Ana"
          kind="connections"
          open={open === "network"}
          onOpenChange={toggle("network")}
          pending={false}
          error={false}
          people={[
            {
              id: "u1",
              username: "bia",
              name: "Bia Lima",
              headline: "Designer",
              avatar: null,
              avatarFrame: null,
              href: "#",
            },
          ]}
        />

        <Button onClick={() => setOpen("manager")}>Projetos</Button>

        <ProjectsManager
          open={open === "manager"}
          onOpenChange={toggle("manager")}
          projects={projects}
          onSave={async () => true}
          onDelete={() => undefined}
          renderHtmlFrame={frame}
        />

        <Button onClick={() => setOpen("project")}>Enviar projeto</Button>

        <ProjectFormDialog
          open={open === "project"}
          onOpenChange={toggle("project")}
          onSave={() => setOpen(null)}
        />
      </div>
    );
  },
};

export const Seals: StoryObj = {
  render: function SealsStory() {
    const [open, setOpen] = useState(true);

    return (
      <div className="max-w-2xl">
        <ProfileSeals
          seals={[
            {
              type: "CODE_CONTRIBUTOR",
              category: "CODE",
              name: "Contribuidora de código",
              categoryName: "Código",
              description: "PRs aceitos nos repositórios da comunidade.",
              minCount: 10,
              maxCount: 49,
              evidenceCount: 12,
              grantedAtLabel: "12 out. 2026",
            },
            {
              type: "BUG_HUNTER",
              category: "ISSUES",
              name: "Caçadora de bugs",
              categoryName: "Issues",
              description: "Issues confirmadas pela equipe.",
              minCount: 50,
              maxCount: null,
              evidenceCount: 0,
              grantedAtLabel: "3 set. 2026",
            },
          ]}
          renderEvidence={(seal) => (
            <SealEvidenceList
              total={seal.evidenceCount}
              open={open}
              onOpenChange={setOpen}
              loading={false}
              error={false}
              items={[
                {
                  repository: "rede-enois/app",
                  kind: "PULL_REQUEST",
                  number: 42,
                  title: "Perfil com selos",
                  url: "https://github.com/rede-enois/app/pull/42",
                },
                {
                  repository: "rede-enois/app",
                  kind: "ISSUE",
                  number: 7,
                  title: "Botão some no modo escuro",
                  url: "https://github.com/rede-enois/app/issues/7",
                },
              ]}
              hasMore
              loadingMore={false}
              onLoadMore={() => undefined}
            />
          )}
        />
      </div>
    );
  },
};

export const GithubImport: StoryObj = {
  render: function GithubImportStory() {
    const [open, setOpen] = useState(false);
    const [notLinked, setNotLinked] = useState(false);
    const [selected, setSelected] = useState<string[]>(["ana/connect"]);
    const rows = [
      {
        name: "connect",
        fullName: "ana/connect",
        description: "Rede de networking com propósito.",
        language: "TypeScript",
        stars: 12,
        forks: 3,
        fork: false,
        archived: false,
        updatedAtLabel: "20 out. 2026",
        url: "https://github.com/ana/connect",
      },
      {
        name: "dotfiles",
        fullName: "ana/dotfiles",
        description: null,
        language: null,
        stars: 0,
        forks: 0,
        fork: true,
        archived: true,
        updatedAtLabel: null,
        url: "https://github.com/ana/dotfiles",
      },
    ];

    return (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setNotLinked(false);
            setOpen(true);
          }}
        >
          Importar do GitHub
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setNotLinked(true);
            setOpen(true);
          }}
        >
          Sem GitHub vinculado
        </Button>

        <GithubImportDialog
          open={open}
          onOpenChange={setOpen}
          notLinked={notLinked}
          securityHref="#"
          repos={{ loading: false, error: false, rows }}
          selected={selected}
          onToggle={(fullName) =>
            setSelected((current) =>
              current.includes(fullName)
                ? current.filter((item) => item !== fullName)
                : [...current, fullName],
            )
          }
          onSelectAll={() => setSelected(rows.map((repo) => repo.fullName))}
          onClear={() => setSelected([])}
          importing={false}
          onImport={() => setSelected([])}
          readme={{
            loading: false,
            missing: false,
            data: { html: "<h1>Oi, eu sou a Ana</h1>", repoUrl: "https://github.com/ana/ana" },
            error: false,
          }}
          usingReadme={false}
          onUseReadme={() => undefined}
          renderHtmlFrame={frame}
        />
      </div>
    );
  },
};

export const CityPrivacy: StoryObj = {
  render: function CityPrivacyStory() {
    const [showCity, setShowCity] = useState(false);

    return (
      <div className="max-w-md space-y-6">
        <ProfileCityPrivacy value={showCity} onChange={setShowCity} />
        <ProfileCityPrivacy value onChange={() => {}} pending />
      </div>
    );
  },
};

// Fake data only: the public work profile with every section filled, owner view.
export const Professional: StoryObj = {
  render: () => (
    <ProfessionalProfile
      backHref="#"
      editHref="#"
      profile={{
        name: "Ana Exemplo",
        username: "ana.exemplo",
        headline: "Engenheira de software focada em plataformas de dados",
        bio: "Construo sistemas que aguentam o dia a dia.\nGosto de mentoria e de documentação clara.",
        location: "Belo Horizonte, MG",
        industry: "Tecnologia",
        identityVerified: true,
        reputation: 1240,
        memberSinceLabel: "mar. 2026",
        skills: ["Go", "PostgreSQL", "Kubernetes", "Observabilidade"],
        links: ["https://example.dev/ana", "https://github.com/example"],
      }}
      experiences={[
        {
          id: "e1",
          title: "Engenheira de software sênior",
          company: "Empresa Exemplo",
          location: "Remoto",
          currentlyHere: true,
          startLabel: "jan. 2024",
          endLabel: null,
          months: 22,
          description: "Plataforma de dados e times de produto.",
        },
        {
          id: "e2",
          title: "Engenheira de software",
          company: "Outra Exemplo",
          startLabel: "fev. 2020",
          endLabel: "dez. 2023",
          months: 47,
        },
      ]}
      educations={[
        {
          id: "d1",
          school: "Universidade Exemplo",
          degree: "Bacharelado",
          field: "Ciência da Computação",
          periodLabel: "2016 a 2020",
        },
      ]}
      certifications={[
        {
          id: "c1",
          name: "Certificação Exemplo",
          issuer: "Instituto Exemplo",
          issuedLabel: "jun. 2025",
          credentialUrl: "https://example.dev/cred",
        },
      ]}
      posts={<p className="text-sm text-text-subtle">Publicações do perfil profissional.</p>}
    />
  ),
};

export const ProfessionalMinimal: StoryObj = {
  render: () => (
    <ProfessionalProfile
      backHref="#"
      profile={{ name: "Perfil Novo", username: "perfil.novo", skills: [], links: [] }}
      experiences={[]}
      educations={[]}
      certifications={[]}
      statusNote="Rascunho: só você vê esta página."
      posts={<p className="text-sm text-text-subtle">Nada publicado ainda.</p>}
    />
  ),
};
