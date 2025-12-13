import { useState } from "react";
import ProjectDetails from "./ProjectDetails";

const ProjectCard = ({
  title,
  description,
  subDescription,
  href,
  image,
  tags,
  setPreview,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-black-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 border border-transparent hover:border-blue-500/50"
        onMouseEnter={() => setPreview && setPreview(image)}
        onMouseLeave={() => setPreview && setPreview(null)}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-black-300">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black-200 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags && tags.slice(0, 4).map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-1 px-2 py-1 bg-black-300 rounded-md"
              >
                {tag.path && (
                  <img
                    src={tag.path}
                    alt={tag.name}
                    className="w-4 h-4 object-contain"
                  />
                )}
                <span className="text-xs text-gray-300">{tag.name}</span>
              </div>
            ))}
            {tags && tags.length > 4 && (
              <div className="px-2 py-1 bg-black-300 rounded-md text-xs text-gray-300">
                +{tags.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProjectDetails
          title={title}
          description={description}
          subDescription={subDescription}
          image={image}
          tags={tags}
          href={href}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProjectCard;
