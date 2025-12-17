# Contributing to ServiceHub

Thank you for your interest in contributing to ServiceHub! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/servicehub.git
   cd servicehub
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🔧 Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Project Structure
```
src/
├── api/                    # API layer and mock data
├── components/            # React components (organized by feature)
├── contexts/             # React contexts for state management
├── types/                # TypeScript type definitions
├── utils/                # Utility functions and translations
└── main.tsx             # Application entry point
```

### Code Style
- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled by Prettier
- **Naming**: Use descriptive names for variables, functions, and components

## 📝 Making Changes

### Branch Naming
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

### Commit Messages
Follow conventional commit format:
- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update README`
- `style: format code`
- `refactor: restructure component`
- `test: add unit tests`

### Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes** thoroughly:
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 🌍 Internationalization

When adding new features:

1. **Add translation keys** to `src/utils/translations.ts`
2. **Use the `t()` function** from `useLanguage` hook
3. **Test both English and Arabic** languages
4. **Ensure RTL support** for Arabic layout

Example:
```typescript
// Add to translations.ts
'new.feature.title': 'New Feature',
'new.feature.title.ar': 'ميزة جديدة',

// Use in component
const { t } = useLanguage();
return <h1>{t('new.feature.title')}</h1>;
```

## 🎨 UI/UX Guidelines

### Design Principles
- **Mobile-first**: Design for mobile, enhance for desktop
- **Accessibility**: Follow WCAG guidelines
- **Consistency**: Use existing design patterns
- **Performance**: Optimize for fast loading

### Component Guidelines
- **Reusability**: Create reusable components
- **Props**: Use TypeScript interfaces for props
- **Styling**: Use Tailwind CSS classes
- **Responsiveness**: Ensure mobile compatibility

## 🧪 Testing

### Manual Testing
- Test on different screen sizes
- Test both English and Arabic languages
- Test all user roles (user, provider, admin)
- Test core user flows

### Automated Testing
- Write unit tests for utility functions
- Test component rendering
- Test user interactions

## 📋 Feature Requests

When proposing new features:

1. **Check existing issues** to avoid duplicates
2. **Provide detailed description** of the feature
3. **Explain the use case** and benefits
4. **Consider impact** on existing functionality
5. **Discuss implementation** approach

## 🐛 Bug Reports

When reporting bugs:

1. **Use the bug report template**
2. **Provide steps to reproduce**
3. **Include screenshots** if applicable
4. **Specify browser/device** information
5. **Check console** for error messages

## 🔍 Code Review

### For Contributors
- **Self-review** your code before submitting
- **Write clear descriptions** in pull requests
- **Respond promptly** to review feedback
- **Keep changes focused** on single feature/fix

### For Reviewers
- **Be constructive** and helpful
- **Focus on code quality** and standards
- **Test the changes** locally
- **Approve when ready** for merge

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [React Developer Tools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- [Git](https://git-scm.com/) - Version control

## 🤝 Community

### Communication
- **GitHub Issues** - for bugs and feature requests
- **Pull Requests** - for code contributions
- **Discussions** - for general questions and ideas

### Code of Conduct
- **Be respectful** and inclusive
- **Help others** learn and grow
- **Focus on constructive** feedback
- **Maintain professional** communication

## 🎯 Priorities

### High Priority
- Bug fixes and security issues
- Performance improvements
- Accessibility enhancements
- Mobile responsiveness

### Medium Priority
- New features and enhancements
- UI/UX improvements
- Code refactoring
- Documentation updates

### Low Priority
- Nice-to-have features
- Experimental functionality
- Advanced customizations

## 📞 Getting Help

If you need help:

1. **Check the documentation** first
2. **Search existing issues** for similar problems
3. **Create a new issue** with detailed information
4. **Join discussions** for community support

Thank you for contributing to ServiceHub! 🌟